
import yaml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .app.agents.researcher import researcher_agent
from .app.agents.synthesizer import synthesizer_agent
from .app import database

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
    # Run the researcher agent to get the data
    research_data = researcher_agent(query.query, query.model, query.provider)
    
    # Run the synthesizer agent with the research data
    final_answer = synthesizer_agent(query.query, research_data, query.model, query.provider)
    
    # Combine the results
    result = {"final_answer": final_answer, "research_data": research_data}
    
    # Now that we have the complete result, save it to the database
    database.save_research_hook(result)
    
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
