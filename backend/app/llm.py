import os
import yaml
import google.generativeai as genai
from openai import OpenAI
from abc import ABC, abstractmethod

class LLMProvider(ABC):
    @abstractmethod
    def generate_text(self, prompt, model_name=None):
        pass

class GeminiProvider(LLMProvider):
    def __init__(self, api_key, model):
        self.api_key = api_key
        self.model = model
        genai.configure(api_key=self.api_key)

    def generate_text(self, prompt, model_name=None):
        model = genai.GenerativeModel(model_name or self.model)
        response = model.generate_content(prompt)
        return response.text

class OpenRouterProvider(LLMProvider):
    def __init__(self, api_key, model):
        self.api_key = api_key
        self.model = model
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=self.api_key,
        )

    def generate_text(self, prompt, model_name=None):
        model = model_name or self.model
        response = self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content

def get_llm_provider(provider=None):
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    
    provider_name = provider or config.get("llm_provider", "gemini")

    if provider_name == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        model = config.get("gemini_model", "gemini-1.5-flash")
        return GeminiProvider(api_key, model)
    elif provider_name == "openrouter":
        api_key = os.getenv("OPENROUTER_API_KEY")
        model = config.get("openrouter_model", "nousresearch/nous-hermes-2-mixtral-8x7b-dpo")
        return OpenRouterProvider(api_key, model)
    else:
        raise ValueError(f"Unsupported LLM provider: {provider_name}")

def generate_text(prompt, model_name=None, provider=None):
    llm_provider = get_llm_provider(provider)
    return llm_provider.generate_text(prompt, model_name)