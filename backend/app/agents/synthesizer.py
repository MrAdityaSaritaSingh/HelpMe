import os
import json
import yaml
from dotenv import load_dotenv
from ..llm import generate_text

load_dotenv()

def synthesizer_agent(query, research_data):
    """
    Synthesizes the research data to answer the user's query.
    """
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    prompt_path = config.get("synthesizer_prompt", "src/prompts/synthesizer_system.txt")

    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    user_prompt = f"INPUT: {json.dumps(research_data, indent=2)}"

    full_prompt = f"{system_prompt}\n\n{user_prompt}"

    return generate_text(full_prompt)