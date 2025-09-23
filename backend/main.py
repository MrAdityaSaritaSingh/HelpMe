
import yaml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .app.agents.researcher import researcher_agent
from .app.agents.synthesizer import synthesizer_agent
from .app import database
from .app.hooks import save_to_json_file_hook

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    """Initializes the database on application startup."""
    database.init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Query(BaseModel):
    query: str
    model: str = None
    provider: str = None

@app.get("/api/models")
def get_models():
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    return {"providers": config.get("llm_providers", [])}

@app.post("/api/research")
def research(query: Query):
    # Step 1: Run the researcher agent to get the data
    research_data = researcher_agent(query.query, query.model, query.provider)
    
    # Step 2: Run the synthesizer agent with the research data
    final_answer = synthesizer_agent(query.query, research_data, query.model, query.provider)
    
    # Step 3: Combine the results into a single object
    result = {"final_answer": final_answer, "research_data": research_data}
    
    # Step 4: Perform post-processing actions (e.g., saving)
    try:
        database.save_research_hook(result)
        save_to_json_file_hook(result)
    except Exception as e:
        print(f"Error during post-processing: {e}")
        # Optionally, you could return an error response here
        # For now, we'll just log it and return the result
        
    return result

@app.get("/api/research/last")
def get_last_research():
    """
    Returns the last successfully completed research result from the database.
    """
    last_result = database.get_last_result()
    if last_result:
        return last_result
    return {"message": "No research has been performed yet."}
