# HelpMe: Approach Overview

This document outlines the technical approach, architectural decisions, and development strategy for the **HelpMe** AI Research Assistant.

---

## 1. High-Level Architecture

The application is built on a modern, decoupled architecture featuring a client-server model. This ensures a clean separation of concerns, enhances scalability, and simplifies maintenance.

-   **Frontend:** A React Single-Page Application (SPA) that provides a dynamic and responsive user interface.
-   **Backend:** A high-performance Python API server built with FastAPI, which orchestrates the entire AI research workflow.
-   **External Services:** The backend integrates with third-party APIs for Large Language Models (LLMs) and web search functionality.

### Data Flow

The following diagram illustrates the typical flow of a user query through the system:

```mermaid
    Frontend -- "1. User sends query" --> BackendAPI
    BackendAPI -- "2. Forwards request" --> Orchestrator
    Orchestrator -- "3. Invokes Researcher" --> Researcher_Agents
    Researcher_Agents -- "4. Makes external call" --> SearchAPI
    SearchAPI -- "5. Return list of articles" --> Researcher_Agent
    Orchestrator -- "6. Invokes Synthesizer with research data" --> Synthesizer_Agents
    Synthesizer_Agents -- "7. Uses LLM for processing" --> LLM
    LLM -- "8. Makes external call" --> ExternalLLM
    Orchestrator -- "9. Stores history" --> DB
    BackendAPI -- "10. Sends final answer" --> Frontend
```

---

## 2. Core Technical Decisions

The technology stack was chosen to prioritize performance, developer experience, and maintainability.

> **Backend (FastAPI & Python):** The backend is a robust API built with FastAPI, chosen for its high performance, asynchronous capabilities, and automatic OpenAPI documentation. The core logic is encapsulated in a multi-agent, workflow-based system. Each agent (`ResearcherAgent`, `SynthesizerAgent`) is a self-contained class with a clear, step-by-step `run()` method. This modular design makes the logic easy to follow, debug, and extend.

> **Frontend (React & Vite):** The user interface is a single-page application (SPA) built with React and bundled with Vite for a fast and efficient development experience. The UI is broken down into discrete, reusable components. To keep the main `App.jsx` component clean, the application's logic is further separated into custom React Hooks (`useQueryHistory`, `useModelSelection`, `useResearch`), which handle state management and side effects.

---

## 3. Strategy for Finding Reliable Sources

The quality of the final answer is highly dependent on the quality of the sources. The strategy for finding reliable information emulates an expert researcher.

1.  **LLM-Powered Query Refinement:** Before any search, the user's initial query is passed to an LLM. A specialized prompt (`query_rewriter_system.txt`) instructs the model to act as a search expert, transforming the query into a concise, keyword-driven format optimized for search engines. This is a critical step for improving the relevance of search results.

2.  **Flexible Search Providers:** The system uses the **Strategy Design Pattern** to allow for interchangeable search providers. By default, it uses DuckDuckGo, but it can be easily configured to use other services like the Google Custom Search API.

3.  **Intelligent Content Extraction:** The `newspaper3k` library extracts the main article content from each URL, intelligently separating core text from ads and boilerplate. To avoid being blocked, the fetcher identifies itself with a standard browser `User-Agent` header.

4.  **Concurrent Fetching:** To accelerate data gathering, all URLs are fetched and parsed concurrently using a `ThreadPoolExecutor`.

---

## 4. LLM Integration Strategy

The application is designed to be **LLM-agnostic**, giving the user maximum control over the "brain" of the operation.

-   **Primary Provider (OpenRouter):** The default provider is **OpenRouter**, an aggregator service that provides access to a vast array of LLMs, including many high-quality, free, and open-source models. This ensures the application can be run out-of-the-box without requiring paid API keys.

-   **Secondary Provider (Google Gemini):** The application also has native support for Google's powerful **Gemini** models, making it an excellent choice for high-quality research and synthesis.

The user can dynamically switch between any configured provider and model directly from the UI, allowing them to choose the best tool for their specific query and budget.

---

## 5. Synthesizer Agent Logic

The `SynthesizerAgent` is responsible for the final, most critical step: transforming the structured JSON data from the researcher into a human-readable answer.

The agent's logic is driven by **prompt engineering**. The system prompt (`synthesizer_system.txt`) gives the LLM a clear persona ("professional research analyst") and a strict set of instructions:
1.  Base the answer **only** on the provided JSON data to prevent hallucinations.
2.  Meticulously cite sources using the format `[1]`, `[2]`, etc.
3.  Follow strict formatting rules to ensure compatibility with the frontend's Markdown and citation-linking components.

The agent takes the user's original query and the research JSON as input, ensuring the final answer is a direct and relevant response to the user's question.

---

## 6. Setup and Run Instructions

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
    The backend will be running at `http://127.0.0.1:8000`.

2.  **Run the Frontend Development Server:**
    ```sh
    cd frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.
