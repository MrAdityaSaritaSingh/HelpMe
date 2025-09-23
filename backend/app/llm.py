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

    def generate_text(self, system_prompt, user_prompt, model_name=None):
        model = genai.GenerativeModel(model_name or self.model)
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        response = model.generate_content(full_prompt)
        return response.text

class OpenRouterProvider(LLMProvider):
    def __init__(self, api_key, model):
        self.api_key = api_key
        self.model = model
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=self.api_key,
        )

    def generate_text(self, system_prompt, user_prompt, model_name=None):
        model = model_name or self.model
        response = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
        )
        return response.choices[0].message.content

def get_llm_provider(provider_name=None):
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    
    if not provider_name:
        provider_name = config.get("default_provider", "gemini")

    provider_config = next((p for p in config.get("llm_providers", []) if p["name"] == provider_name), None)

    if not provider_config:
        raise ValueError(f"Unsupported LLM provider: {provider_name}")

    api_key_env = provider_config.get("api_key_env")
    api_key = os.getenv(api_key_env)
    default_model = provider_config.get("models", [None])[0]

    if provider_name == "gemini":
        return GeminiProvider(api_key, default_model)
    elif provider_name == "openrouter":
        return OpenRouterProvider(api_key, default_model)
    else:
        # This part might be redundant if the check above is sufficient
        raise ValueError(f"Unsupported LLM provider: {provider_name}")

def generate_text(system_prompt, user_prompt, model_name=None, provider=None):
    llm_provider = get_llm_provider(provider)
    return llm_provider.generate_text(system_prompt, user_prompt, model_name)