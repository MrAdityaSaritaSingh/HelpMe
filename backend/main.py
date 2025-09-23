
import yaml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .app.agents.researcher import researcher_agent
from .app.agents.synthesizer import synthesizer_agent

app = FastAPI()

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
    research_data = researcher_agent(query.query, query.model, query.provider)
    final_answer = synthesizer_agent(query.query, research_data, query.model, query.provider)
    return {"final_answer": final_answer, "research_data": research_data}
