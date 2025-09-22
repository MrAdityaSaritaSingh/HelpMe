import os
import json
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

    with open("src/prompts/synthesizer_system.txt", "r") as f:
        prompt_template = f.read()

    prompt = prompt_template.format(
        query=query,
        research_data=json.dumps(research_data, indent=4)
    )

    response = model.generate_content(prompt)
    return response.text