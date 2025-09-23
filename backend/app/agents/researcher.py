import os
import json
import yaml
from datetime import datetime
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed
from ..tools.search import search
from ..tools.fetch import extract_article
from ..llm import generate_text

load_dotenv()

class ResearcherAgent:
    def __init__(self, query, model_name=None, provider=None):
        self.original_query = query
        self.model_name = model_name
        self.provider = provider
        self.research_data = {}

    def run(self):
        """Executes the entire research workflow."""
        # Step 0: Rewrite the user's query for better search results
        rewritten_query = self._step_0_rewrite_query()

        # Step 1: Initial web search to get URLs
        urls = self._step_1_search(rewritten_query)

        # Step 2: Fetch and parse content from URLs in parallel
        fetched_content = self._step_2_fetch_and_parse(urls)

        # Step 3: Prepare the prompt and generate the final JSON from the LLM
        self.research_data = self._step_3_generate_json(fetched_content)
        
        return self.research_data

    def _step_0_rewrite_query(self):
        """Uses an LLM to rewrite the user's query for better search results."""
        print(f"Rewriting query: '{self.original_query}'")
        with open("config.yaml", "r") as f:
            config = yaml.safe_load(f)
        
        prompt_path = config.get("query_rewriter_prompt", "backend/app/prompts/query_rewriter_system.txt")
        with open(prompt_path, "r") as f:
            system_prompt = f.read()
        
        rewritten_query = generate_text(system_prompt, self.original_query, self.model_name, self.provider).strip()
        print(f"Rewritten query: '{rewritten_query}'")
        return rewritten_query

    def _step_1_search(self, query):
        """Performs the initial web search and returns a list of URLs."""
        print(f"Executing search for query: '{query}'")
        search_results = search(query)
        return [item.get("link") or item.get("href") for item in search_results.get("items", [])[:7]]

    def _step_2_fetch_and_parse(self, urls):
        """Fetches and parses content from multiple URLs concurrently."""
        print(f"Fetching content from {len(urls)} URLs...")
        fetched_content = []
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_url = {executor.submit(extract_article, url): url for url in urls}
            for future in as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    title, text = future.result()
                    if title and text:
                        fetched_content.append({"url": url, "title": title, "content": text})
                except Exception as exc:
                    print(f'Error fetching {url}: {exc}')
        return fetched_content

    def _step_3_generate_json(self, fetched_content):
        """Prepares the prompt and calls the LLM to generate the structured JSON output."""
        print("Generating final JSON from LLM...")
        context = "\n\n".join([f"URL: {item['url']}\nTitle: {item['title']}\nContent: {item['content'][:1500]}" for item in fetched_content])
        
        with open("config.yaml", "r") as f:
            config = yaml.safe_load(f)
        
        prompt_path = config.get("researcher_prompt", "src/prompts/researcher_system.txt")
        with open(prompt_path, "r") as f:
            system_prompt = f.read()

        user_prompt = f"User Query: {self.original_query}\n\nWeb Search Results:\n---\n{context}\n---\nPlease analyze the provided search results and generate the JSON output as per the schema."
        
        response_text = generate_text(system_prompt, user_prompt, self.model_name, self.provider)

        try:
            json_response = response_text.strip().replace("```json", "").replace("```", "")
            research_data = json.loads(json_response)
            # Ensure the original query is in the final output
            research_data["query"] = self.original_query
            research_data["completed_at_utc"] = datetime.utcnow().isoformat()
            return research_data
        except (json.JSONDecodeError, TypeError) as e:
            print(f"Error decoding JSON from researcher agent: {e}")
            return {
                "query": self.original_query,
                "completed_at_utc": datetime.utcnow().isoformat(),
                "sources": [],
                "error": "Failed to generate valid JSON research data."
            }

# The public function that will be called by the API
def researcher_agent(query, model_name=None, provider=None):
    agent = ResearcherAgent(query, model_name, provider)
    return agent.run()
