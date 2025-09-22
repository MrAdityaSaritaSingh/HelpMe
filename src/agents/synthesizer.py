import os
import json
import yaml
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def synthesizer_agent(query, research_data):
    """
    Synthesizes the research data to answer the user's query.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    prompt_path = config.get("synthesizer_prompt", "src/prompts/synthesizer_system.txt")

    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    user_prompt = f"INPUT: {json.dumps(research_data, indent=2)}"

    full_prompt = f"{system_prompt}\n\n{user_prompt}"

    response = model.generate_content(full_prompt)
    return response.text