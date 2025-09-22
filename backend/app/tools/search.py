
import os
import yaml
import requests
from ddgs import DDGS
from dotenv import load_dotenv

load_dotenv()

def _search_google(query):
    """
    Searches using the Google Custom Search API.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    cse_id = os.getenv("GOOGLE_CSE_ID")
    if not api_key or not cse_id:
        raise ValueError("GOOGLE_API_KEY and GOOGLE_CSE_ID must be set in .env for Google Search")
    
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": api_key,
        "cx": cse_id,
        "q": query
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def _search_duckduckgo(query, max_results=5):
    """
    Searches using the DuckDuckGo Search API.
    """
    with DDGS() as ddgs:
        results_generator = ddgs.text(query, max_results=max_results)
        formatted_results = {"items": []}
        for i, result in enumerate(results_generator):
            formatted_results["items"].append({
                "title": result.get('title'),
                "link": result.get('href')
            })
            if i + 1 >= max_results:
                break
        return formatted_results

def search(query):
    """
    Performs a web search using the tool specified in config.yaml.
    """
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    
    tool = config.get("search_tool", "duckduckgo") # Default to duckduckgo

    if tool == "google":
        return _search_google(query)
    elif tool == "duckduckgo":
        return _search_duckduckgo(query)
    else:
        raise ValueError(f"Invalid search tool specified in config.yaml: {tool}")
