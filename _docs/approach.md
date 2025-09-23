# Project Approach & Technical Choices

This document outlines the technical approach, design patterns, and strategic decisions made during the development of the **HelpMe** AI Research Assistant.

---

## 1. Overall Approach & Technical Choices

The project is built on a modern, decoupled architecture to ensure scalability, maintainability, and a clean separation of concerns.

-   **Backend (FastAPI & Python):** The backend is a robust API built with FastAPI, chosen for its high performance, asynchronous capabilities, and automatic documentation. The core logic is encapsulated in a multi-agent, workflow-based system. Each agent (`ResearcherAgent`, `SynthesizerAgent`) is a self-contained class with a clear, step-by-step `run()` method. This modular, workflow-inspired design makes the logic easy to follow, debug, and extend.

-   **Frontend (React & Vite):** The user interface is a single-page application (SPA) built with React and bundled with Vite for a fast and efficient development experience. The UI is broken down into discrete, reusable components. To keep the main `App.jsx` component clean and manageable, the application's logic is further separated into custom React Hooks (`useQueryHistory`, `useModelSelection`, `useResearch`), which handle state management and side effects.

-   **Styling (Tailwind CSS):** The UI is styled using Tailwind CSS. This utility-first framework was chosen to enable rapid, consistent, and responsive design directly within the component markup.

---

## 2. Strategy for Finding Reliable, High-Quality Sources

The quality of the final answer is highly dependent on the quality of the sources. The strategy for finding reliable information involves a multi-step process designed to emulate an expert researcher.

1.  **LLM-Powered Query Refinement:** Before any search is performed, the user's initial, often conversational, query is passed to an LLM. A specialized prompt (`query_rewriter_system.txt`) instructs the model to act as a search expert, transforming the query into a concise, keyword-driven format optimized for search engines. This is the most critical step for improving the relevance of search results.

2.  **Flexible Search Providers:** The system uses the **Strategy Design Pattern** to allow for interchangeable search providers. By default, it uses DuckDuckGo for its privacy and ease of use. However, it can be easily configured to use the Google Custom Search API for potentially more comprehensive results.

3.  **Intelligent Content Extraction:** Once a list of URLs is retrieved, the `newspaper3k` library is used to extract the main article content from each page. This tool is specifically designed to parse HTML and intelligently separate the core text from ads and boilerplate. To avoid being blocked by websites, the fetcher identifies itself with a standard browser `User-Agent` header.

4.  **Concurrent Fetching:** To significantly speed up the data gathering process, all URLs are fetched and parsed concurrently using a `ThreadPoolExecutor`.

---

## 3. LLM Selection & Rationale

The application is designed to be **LLM-agnostic**, giving the user maximum control over the "brain" of the operation.

-   **Primary Provider (OpenRouter):** The default and recommended provider is **OpenRouter**. This powerful service acts as an aggregator, providing access to a vast array of different LLMs, including many high-quality, free, and open-source models (like `deepseek`, `mistral`, and `gemma`). This was chosen to ensure that the application can be run and tested by anyone out-of-the-box without requiring paid API keys.

-   **Secondary Provider (Google Gemini):** The application also has native support for Google's **Gemini** models. Gemini is a powerful, multi-modal, and widely respected family of models, making it an excellent choice for high-quality research and synthesis.

The user can dynamically switch between any configured provider and model directly from the UI, allowing them to choose the best tool for their specific query and budget.

---

## 4. Synthesizer Agent Logic

The `SynthesizerAgent` is responsible for the final, most critical step: transforming the structured JSON data from the researcher into a human-readable answer.

The agent's logic is almost entirely driven by **prompt engineering**. The system prompt (`synthesizer_system.txt`) gives the LLM a clear persona ("professional research analyst") and a strict set of instructions:
1.  Base the answer **only** on the provided JSON data to prevent hallucinations.
2.  Meticulously cite sources using the format `[1]`, `[2]`, etc.
3.  Follow strict formatting rules to ensure compatibility with the frontend's Markdown and citation-linking components. Specifically, it is instructed to place citations individually (e.g., `[1][2]`) and to **omit** a final "Sources" list, as the UI handles this dynamically.

The agent takes the user's original query and the research JSON as input, ensuring the final answer is not just a summary of the data, but a direct and relevant response to the user's question.

---

## 5. Setup and Run Instructions

*Note: These instructions are also available in the main `README.md` file.*

### Prerequisites

-   **Python 3.10+** and `pip`
-   **Node.js 18+** and `npm`
-   Git

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/HelpMe.git
    cd HelpMe
    ```

2.  **Backend Setup:**
    ```sh
    # Create and activate a virtual environment
    python -m venv .venv
    source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate

    # Install Python dependencies
    pip install -r requirements.txt
    ```

3.  **Frontend Setup:**
    ```sh
    # Navigate to the frontend directory and install npm packages
    cd frontend
    npm install
    cd .. 
    ```

4.  **Configure API Keys:**
    -   Create a `.env` file in the project root by copying the example:
        ```sh
        cp .env.example .env
        ```
    -   Open the `.env` file and add your API keys for Gemini and/or OpenRouter.

### Running the Application

You'll need to run the backend and frontend servers in two separate terminals.

1.  **Run the Backend Server:**
    ```sh
    # Make sure your virtual environment is activated
    uvicorn backend.main:app --reload
    ```
    The backend will be running at `http://12-7.0.0.1:8000`.

2.  **Run the Frontend Development Server:**
    ```sh
    cd frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.