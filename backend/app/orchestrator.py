
import json
from .agents.researcher import researcher_agent
from .agents.synthesizer import synthesizer_agent

def run():
    """
    Runs the AI agent pipeline.
    takes user input, runs the researcher agent to gather data,
    then runs the synthesizer agent to produce a final answer.
    """
    user_query = input("Please enter your research query: ")
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
    print("\n\nFinal Answer:")
    print(final_answer)

if __name__ == "__main__":
    run()
