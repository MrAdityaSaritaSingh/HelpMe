# 🚀 Autonomous Business Analyst — Internship Task

This project implements an **autonomous agent system** that can research business/management concepts online, synthesize findings, and produce a **reliable, well-cited answer** for students on an online learning platform.

---

## 📌 Problem Statement

A student asks:

> *“What is the RICE scoring model for prioritization, and how is it different from the Kano model?”*

The task:

* Build an **agent pipeline** that can research this question (and similar ones in the future).
* Collect information from **multiple online sources**.
* **Synthesize & fact-check** results.
* Produce a **single clear answer with citations**.

---

## 🏗️ System Architecture

The project follows a **layered agent design**:

### 1. Researcher Agents (Layer 1)

* Use a search API or scraping library to discover **3–7 credible sources**.
* Extract metadata, key points, and structured facts.
* Return results in strict **JSON schema**:

  * Source URLs, titles, authors, dates.
  * Snippets, key points, possible contradictions.
  * Reliability scores.

### 2. Synthesizer & Fact-Checker Agent (Layer 2)

* Consumes the JSON output from Layer 1.
* Identifies **consistent themes** and **contradictions**.
* Synthesizes a **concise, student-friendly explanation**.
* Ensures **citations** are attached to every important point.

---

## ⚙️ Tech Stack & Tools

* **Programming Language:** Python 3.10+
* **LLMs:** Flexible (supports OpenAI, Anthropic, or local open-source models)
* **Frameworks/Libraries:**

  * [LangChain](https://www.langchain.com/) or [LlamaIndex](https://www.llamaindex.ai/) for orchestration
  * `requests`, `BeautifulSoup4`, `newspaper3k` for web scraping (if no API available)
  * Vector DB (FAISS/Chroma) for storage & retrieval (optional)

---

## 📂 Project Structure

```bash
autonomous-business-analyst/
│── src/
│   ├── researcher_agent.py    # Finds and extracts online sources
│   ├── synthesizer_agent.py   # Synthesizes and fact-checks answers
│   ├── main.py                # Orchestrates the full pipeline
│── output/
│   ├── final_answer.txt       # Generated answer to the student’s question
│── docs/
│   ├── approach.md            # Explains design decisions & reasoning
│── README.md                  # This file
│── requirements.txt           # Dependencies
```

---

## 📝 Approach & Key Decisions

1. **Source Selection**

   * Prioritize product management blogs, expert articles, educational sites.
   * Avoid thin SEO content and duplicate Wikipedia clones.

2. **Model Choice**

   * Default: GPT-4 or Claude for synthesis (high reasoning ability).
   * Alternative: Open-source LLaMA-2 / Mistral with retrieval augmentation.

3. **Fact-Checking Strategy**

   * Compare extracted points across multiple sources.
   * Mark contradictions in JSON for the synthesizer to handle.

4. **Answer Generation**

   * Student-friendly (clear, simple explanations).
   * Concise but thorough.
   * Always includes citations with clickable links.

---

## ▶️ How to Run

1.  **Clone Repository**

   ```bash
   git clone https://github.com/your-username/HelpMe.git
   cd HelpMe
   ```

2.  **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3.  **Set Environment Variables**

   Create a `.env` file (you can copy `.env.example`) and add your API keys.

4.  **Run the Pipeline**

   ```bash
   python -m src.orchestrator
   ```

5.  **View Results**

   * Final answer saved in `output/final_answer.txt`.
   * Logs & JSON stored for debugging.

---

## ✅ Deliverables

1. **Code** → GitHub repository with modular design.
2. **Approach Document** → `docs/approach.md` explaining reasoning.
3. **Final Output** → A synthesized, cited answer in `output/final_answer.txt`.

---

## 🔍 Evaluation Criteria (per task brief)

* **Problem-Solving & Resourcefulness** → Ability to adapt to missing data/APIs.
* **Critical Thinking** → Using multiple credible sources, not just one.
* **Output Quality** → Accurate, concise, student-friendly explanations.
* **Clarity** → Well-organized code & clear documentation.
* **Attention to Detail** → Proper citations, error-free output.

---

## 📖 Example Output (excerpt)

```txt
The RICE framework (Reach, Impact, Confidence, Effort) is a prioritization scoring model
used to rank product initiatives by expected value. It calculates:

RICE Score = (Reach × Impact × Confidence) ÷ Effort

By contrast, the Kano model categorizes features based on customer satisfaction:
Must-have, Performance, Attractive, Indifferent, and Reverse features.
Unlike RICE’s quantitative formula, Kano is a qualitative model focusing on how features
influence satisfaction.

Sources:
- https://www.intercom.com/blog/rice-prioritization
- https://foldingburritos.com/kano-model
- https://productplan.com/learn/kano-model
```