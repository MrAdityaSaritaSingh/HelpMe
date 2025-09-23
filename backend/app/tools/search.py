import os
import yaml
import requests
from ddgs import DDGS
from dotenv import load_dotenv
from abc import ABC, abstractmethod

load_dotenv()

class SearchProvider(ABC):
    """Abstract base class for a search provider."""
    @abstractmethod
    def search(self, query, max_results=7):
        pass

class GoogleSearch(SearchProvider):
    """Searches using the Google Custom Search API."""
    def search(self, query, max_results=7):
        api_key = os.getenv("GOOGLE_API_KEY")
        cse_id = os.getenv("GOOGLE_CSE_ID")
        if not api_key or not cse_id:
            raise ValueError("GOOGLE_API_KEY and GOOGLE_CSE_ID must be set for Google Search.")
        
        url = "https://www.googleapis.com/customsearch/v1"
        params = {"key": api_key, "cx": cse_id, "q": query, "num": max_results}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

class DuckDuckGoSearch(SearchProvider):
    """Searches using the DuckDuckGo Search API."""
    def search(self, query, max_results=7):
        with DDGS() as ddgs:
            results_generator = ddgs.text(query, max_results=max_results)
            return {"items": list(results_generator)}

def get_search_provider() -> SearchProvider:
    """
    Factory function to get the search provider based on the config.
    """
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    
    tool = config.get("search_tool", "duckduckgo")
    
    if tool == "google":
        return GoogleSearch()
    elif tool == "duckduckgo":
        return DuckDuckGoSearch()
    else:
        raise ValueError(f"Invalid search tool in config: {tool}")

def search(query, max_results=7):
    """
    Performs a web search using the tool specified in config.yaml.
    """
    provider = get_search_provider()
    return provider.search(query, max_results)