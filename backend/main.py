from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from g4f.client import Client

# uvicorn main:app --reload


app = FastAPI()
client = Client()


# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model

class QueryModel(BaseModel):
    query: str

# POST endpoint
@app.post("/process")
async def process_data(query_model: QueryModel):
    query = query_model.query
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    print(f"Received query: {query}")   
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": f"Given this the location, {query}"}],
    )
    message = response.choices[0].message.content
    query = ""
    # Return the processed data
    return {
        "original": query,
        "message": f"{message}."
    }
