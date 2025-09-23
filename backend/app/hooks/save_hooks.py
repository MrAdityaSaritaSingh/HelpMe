import json
import re
from datetime import datetime

def save_to_json_file_hook(research_data):
    """
    A post-processing hook that saves the research data to a JSON file.
    The filename is generated from the query and a timestamp.
    """
    print("Executing hook: save_to_json_file_hook")
    
    # Get the original query from the research data
    query = research_data.get("research_data", {}).get("query", "untitled_research")
    
    # Sanitize the query to create a safe filename
    safe_filename = re.sub(r'[^a-zA-Z0-9_]', '_', query).lower()
    safe_filename = safe_filename[:50]
    
    # Add a timestamp for uniqueness
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"output/{safe_filename}_{timestamp}.json"
    
    # Save the data
    with open(filename, "w") as f:
        json.dump(research_data, f, indent=4)
        
    print(f"Successfully saved research data to {filename}")
