
import json
from src.agents.researcher import researcher_agent
from src.agents.synthesizer import synthesizer_agent

def run():
    """
    Runs the AI agent pipeline.
    """
    user_query = "What is the difference between market research and marketing research?"
    print(f"Running researcher agent for query: '{user_query}'")
    research_data = researcher_agent(user_query)
    with open("output/research_results.json", "w") as f:
        json.dump(research_data, f, indent=4)
    print("Research complete. Results saved to output/research_results.json")

    print("Running synthesizer agent...")
    final_answer = synthesizer_agent(user_query, research_data)
    with open("output/final_answer.txt", "w") as f:
        f.write(final_answer)
    print("Synthesis complete. Final answer saved to output/final_answer.txt")

if __name__ == "__main__":
    run()
