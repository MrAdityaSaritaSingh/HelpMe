# AI Research Assistant

This project is an AI-powered research assistant that helps you conduct research on any topic. It uses a multi-agent approach to gather, analyze, and synthesize information from the web.

## Features

-   **Multi-Agent System:** The assistant uses two agents: a Researcher and a Synthesizer.
-   **Researcher Agent:** This agent searches the web for relevant information on a given topic.
-   **Synthesizer Agent:** This agent takes the research data and synthesizes it into a coherent answer.
-   **LLM Agnostic:** The assistant can be configured to use different LLMs, including Gemini and models from OpenRouter.
-   **Web Interface:** The project includes a simple web interface for interacting with the assistant.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-research-assistant.git
    ```
2.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    cd frontend
    npm install
    ```
3.  **Set up your API keys:**
    -   Create a `.env` file in the root directory and add your API keys:
        ```
        GEMINI_API_KEY="your_gemini_api_key"
        OPENROUTER_API_KEY="your_openrouter_api_key"
        ```
4.  **Configure the assistant:**
    -   Open the `config.yaml` file to configure the LLM provider, model, and search tool.
5.  **Run the backend:**
    ```bash
    uvicorn backend.main:app --reload
    ```
6.  **Run the frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

## Usage

1.  Open your browser and navigate to `http://localhost:5173`.
2.  Enter a research query in the search bar and click "Research".
3.  The assistant will gather and analyze information, and then display the final answer.
