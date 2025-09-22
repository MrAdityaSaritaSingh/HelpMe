
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .agents.researcher import researcher_agent
from .agents.synthesizer import synthesizer_agent

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

@app.post("/research")
def research(query: Query):
    research_data = researcher_agent(query.query)
    final_answer = synthesizer_agent(query.query, research_data)
    return {"final_answer": final_answer, "research_data": research_data}
