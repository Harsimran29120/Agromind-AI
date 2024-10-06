from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from g4f.client import Client
import requests
import json
from datetime import datetime

username = 'farhang_amirmohammad'
password = 'E6kYbog9L4'
base_url = 'https://api.meteomatics.com'
parameters = 'wind_speed_10m:ms,msl_pressure:hPa,soil_moisture_deficit:mm,evapotranspiration_24h:mm,air_quality:idx,pm2p5:ugm3,forest_fire_warning:idx,heavy_rain_warning_24h:idx'
datetime_now = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

# Data structure
dataDict = [
    {"name": "wind_speed_10m:ms", "value": 0},
    {"name": "msl_pressure:hPa", "value": 0},
    {"name": "soil_moisture_deficit:mm", "value": 0},
    {"name": "evapotranspiration_24h:mm", "value": 0},
    {"name": "air_quality:idx", "value": 0},
    {"name": "pm2p5:ugm3", "value": 0},
    {"name": "forest_fire_warning:idx", "value": 0},
    {"name": "heavy_rain_warning_24h:idx", "value": 0}
]

# FastAPI app instance
app = FastAPI()
client = Client()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for query and coordinates
class QueryModel(BaseModel):
    
    latitude: float
    longitude: float

# POST endpoint to handle queries
@app.post("/chat")
async def process_data(query_model: QueryModel):
    
    latitude = query_model.latitude
    longitude = query_model.longitude

    print(f"Latitude: {latitude}, Longitude: {longitude}")

    

    # Dynamic location
    location = f"{latitude},{longitude}"
    url = f'{base_url}/{datetime_now}/{parameters}/{location}/json'

    response = requests.get(url, auth=(username, password))
    
    if response.status_code == 200:
        data = response.json()
        for item in data['data']:
            for name in dataDict:
                if name['name'] == item['parameter']:
                    name['value'] = item['coordinates'][0]['dates'][0]['value']
    else:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    # Generating modified query with data
    modified_query = f"Give the result in JSON format. As an expert in agriculture and environmental science, analyze critical parameters affecting farming. Evaluate wind speed at {dataDict[0]['value']} m/s: 0-3 (no impact), 3-6 (minor), 6-10 (moderate), >10 (severe). Assess pressure at {dataDict[1]['value']} hPa: >1020 (fair), <1000 (storms). Check soil moisture at {dataDict[2]['value']} mm: 0-25 (adequate), 25-100 (moderate), >100 (urgent). Examine evapotranspiration at {dataDict[3]['value']} mm/day: 0-2 (none), 2-8 (normal), >8 (intensive). Analyze air quality at {dataDict[4]['value']}: 0-50 (good), 50-100 (moderate), >300 (poor). PM2.5 at {dataDict[5]['value']} µg/m³: 0-10 (safe), >75 (harmful). Fire warnings at {dataDict[6]['value']}: 0-0.3 (low), 0.7-1.0 (high). Rain warnings at {dataDict[7]['value']}: 0 (no risk), 3 (severe). Provide a summary and risk assessment for each parameter in the report."

    # Using the client to generate a response
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": f"{modified_query}"}],
    )
    message = response.choices[0].message.content
    print(message)
    # Returning the response
    return {
        "message": message
    }
