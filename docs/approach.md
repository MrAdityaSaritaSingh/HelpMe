
# Approach Document

This document outlines the technical approach for the topic-agnostic AI agent system.

## System Architecture

The system is designed with a two-layered agent pipeline:

1.  **Researcher Agent:** This agent is responsible for finding and extracting information from high-quality online sources.
2.  **Synthesizer & Fact-Checker Agent:** This agent processes the information from the Researcher agent, synthesizes it, and generates a final, cited answer.

This modular architecture allows for easy debugging, upgrading, and adaptation to new business concept queries.

## Technical Choices

### Layer 1: Researcher Agent

-   **Programming Language:** Python
-   **Libraries:**
    -   `duckduckgo-search`: For performing web searches with DuckDuckGo.
    -   `requests`: For making HTTP requests to the Google Custom Search API.
    -   `newspaper3k`: For extracting the main text from articles.
    -   `python-dotenv`: For managing environment variables.
    -   `PyYAML`: For reading the configuration file.

### Layer 2: Synthesizer & Fact-Checker Agent

-   **Programming Language:** Python
-   **Libraries:**
    -   `google-generativeai`: For interacting with the Gemini Pro LLM.
    -   `python-dotenv`: For managing environment variables.

## Configuration

The search tool for the Researcher Agent can be configured in the `config.yaml` file.

-   **`search_tool`**: Choose between `"duckduckgo"` (default, no API key required) or `"google"`.

## LLM Selection Rationale

For the Synthesizer agent, we are using the `gemini-pro` model from Google. This model is well-suited for this task due to its strong language understanding and generation capabilities. It can effectively synthesize information from multiple sources, identify key points, and generate a coherent, well-structured response.

Alternative open-source models like Llama 2 could also be used via a framework like Ollama. This would provide more control over the model and potentially reduce costs, but may require more setup and management.

## Agent Logic

### Researcher Agent

1.  The agent takes a user query as input.
2.  It reads the `config.yaml` file to determine which search tool to use.
3.  It uses the selected search tool (`duckduckgo-search` or Google Custom Search API) to find relevant online sources.
4.  For each source, it uses the `newspaper3k` library to extract the main article text.
5.  It then creates a JSON object containing a list of the sources, including the URL, title, and a concise summary of each source.
6.  The agent also includes a field for flagging any potential contradictions or unusual claims found across the sources (this feature is currently a placeholder and can be expanded upon).

### Synthesizer & Fact-Checker Agent

1.  The agent takes the user query and the JSON data from the Researcher agent as input.
2.  It constructs a detailed prompt for the `gemini-pro` model, instructing it to synthesize the information, fact-check it, cite the sources, and format the output.
3.  The agent then sends the prompt to the model and receives the generated response.
4.  The final response is saved to the `output/final_answer.txt` file.

## How to Run the Project

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure the search tool:**
    Open `config.yaml` and set the `search_tool` to either `"duckduckgo"` or `"google"`.

4.  **Set up the environment variables:**
    Create a `.env` file (you can copy `.env.example`) and add the following variable:
    ```
    # Required for the Synthesizer Agent
    GEMINI_API_KEY=<your-gemini-api-key>

    # Optional: Required only if using "google" as the search_tool in config.yaml
    GOOGLE_API_KEY=<your-google-api-key>
    GOOGLE_CSE_ID=<your-google-cse-id>
    ```

5.  **Run the orchestrator:**
    ```bash
    python -m src.orchestrator
    ```
    This will run the full pipeline and create the `final_answer.txt` and `research_results.json` files in the `output` directory.
