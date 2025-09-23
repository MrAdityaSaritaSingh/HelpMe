import os
import json
import yaml
from dotenv import load_dotenv
from ..llm import generate_text

load_dotenv()

class SynthesizerAgent:
    def __init__(self, query, research_data, model_name=None, provider=None):
        self.query = query
        self.research_data = research_data
        self.model_name = model_name
        self.provider = provider

    def run(self):
        """Executes the synthesis workflow."""
        # Step 1: Prepare the prompt for the LLM
        system_prompt, user_prompt = self._step_1_prepare_prompt()

        # Step 2: Generate the final answer
        final_answer = self._step_2_generate_answer(system_prompt, user_prompt)
        
        return final_answer

    def _step_1_prepare_prompt(self):
        """Prepares the system and user prompts for the LLM."""
        print("Preparing prompt for synthesizer agent...")
        with open("config.yaml", "r") as f:
            config = yaml.safe_load(f)

        prompt_path = config.get("synthesizer_prompt", "src/prompts/synthesizer_system.txt")

        with open(prompt_path, "r") as f:
            system_prompt = f.read()

        user_prompt = f"User Query: {self.query}\n\nResearch Data:\n---\n{json.dumps(self.research_data, indent=2)}"
        
        return system_prompt, user_prompt

    def _step_2_generate_answer(self, system_prompt, user_prompt):
        """Calls the LLM to generate the final, synthesized answer."""
        print("Generating final answer from LLM...")
        return generate_text(system_prompt, user_prompt, self.model_name, self.provider)

# The public function that will be called by the API
def synthesizer_agent(query, research_data, model_name=None, provider=None):
    agent = SynthesizerAgent(query, research_data, model_name, provider)
    return agent.run()
