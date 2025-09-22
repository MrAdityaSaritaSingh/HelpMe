import os
import yaml
import google.generativeai as genai
from openai import OpenAI

def get_llm_provider():
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    return config.get("llm_provider", "gemini")

def generate_text(prompt, model_name=None):
    provider = get_llm_provider()

    if provider == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name or 'gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text
    elif provider == "openrouter":
        api_key = os.getenv("OPENROUTER_API_KEY")
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
        with open("config.yaml", "r") as f:
            config = yaml.safe_load(f)
        model = model_name or config.get("openrouter_model", "nousresearch/nous-hermes-2-mixtral-8x7b-dpo")
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")
