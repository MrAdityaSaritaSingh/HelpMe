import os
import json
import yaml
from datetime import datetime
from dotenv import load_dotenv
from ..tools.search import search
from ..tools.fetch import extract_article
from ..llm import generate_text

load_dotenv()

def researcher_agent(query, model_name=None, provider=None):
    """
    Researches a given query and returns a structured JSON output.
    """
    # 1. Initial Search to get a list of URLs
    search_results = search(query)
    urls = [item["link"] for item in search_results.get("items", [])[:7]] # Get top 7 URLs

    # 2. Fetch content from each URL
    fetched_content = []
    for url in urls:
        title, text = extract_article(url)
        if title and text:
            fetched_content.append({
                "url": url,
                "title": title,
                "content": text
            })

    # 3. Prepare the context and prompt for the LLM
    context = "\n\n".join([f"URL: {item['url']}\nTitle: {item['title']}\nContent: {item['content'][:1500]}" for item in fetched_content])
    
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    
    prompt_path = config.get("researcher_prompt", "src/prompts/researcher_system.txt")

    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    # Construct a user prompt that includes the query and the fetched context
    user_prompt = f"User Query: {query}\n\nWeb Search Results:\n---\n{context}\n---\nPlease analyze the provided search results and generate the JSON output as per the schema."

    # 4. Call the LLM with the system and user prompts
    full_prompt = f"{system_prompt}\n\n{user_prompt}"
    
    response_text = generate_text(full_prompt, model_name, provider)

    # 5. Clean up and return the JSON response
    try:
        # The response might be wrapped in markdown, so we need to extract the JSON part
        json_response = response_text.strip()
        if json_response.startswith("```json"):
            json_response = json_response[7:]
        if json_response.endswith("```"):
            json_response = json_response[:-3]
        
        research_data = json.loads(json_response)
        # Add a timestamp to the final output
        research_data["completed_at_utc"] = datetime.utcnow().isoformat()
        return research_data
    except (json.JSONDecodeError, TypeError) as e:
        print(f"Error decoding JSON from researcher agent: {e}")
        # Return a fallback structure in case of an error
        return {
            "query": query,
            "completed_at_utc": datetime.utcnow().isoformat(),
            "sources": [],
            "coverage_summary": {
                "consistent_themes": [],
                "differences_or_conflicts": [],
                "gaps_or_uncertainties": ["Failed to generate research data due to an error."]
            }
        }