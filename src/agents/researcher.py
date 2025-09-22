import json
from src.tools.search import search
from src.tools.fetch import extract_article

def researcher_agent(query):
    """
    Researches a given query and returns a list of sources.
    """
    search_results = search(query)
    sources = []
    if "items" in search_results:
        for item in search_results["items"][:5]:  # Limit to 5 results
            url = item["link"]
            title, text = extract_article(url)
            if title and text:
                sources.append({
                    "url": url,
                    "title": title,
                    "summary": text[:500] + "..."  # Truncate summary
                })
    return {"sources": sources, "contradictions": []}