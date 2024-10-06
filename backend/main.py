from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from g4f.client import Client
import requests
import json
from datetime import datetime

username = 'singh_harsimran'
password = 'lmE0CP8yo8'

LATITUDE = 45.0703
LONGITUDE = 7.6869

# uvicorn main:app --reload

dataDict = [
    {
    "name": "wind_speed_10m:ms",
    "value": 0
    },
    {
    "name": "msl_pressure:hPa",
    "value": 0
    },
    {
    "name": "soil_moisture_deficit:mm",
    "value": 0
    },
    {
    "name": "evapotranspiration_24h:mm",
    "value": 0
    },
    {
    "name": "air_quality:idx",
    "value": 0 
    },
    {
    "name": "pm2p5:ugm3",
    "value": 0
    },
    {
    "name": "forest_fire_warning:idx",
    "value": 0
    },
    {
    "name": "heavy_rain_warning_24h:idx",
    "value": 0
    }
    
]

base_url = 'https://api.meteomatics.com'
parameters = 'wind_speed_10m:ms,msl_pressure:hPa,soil_moisture_deficit:mm,evapotranspiration_24h:mm,air_quality:idx,pm2p5:ugm3,forest_fire_warning:idx,heavy_rain_warning_24h:idx'
location = f"{LATITUDE},{LONGITUDE}" 
datetime_now = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

url = f'{base_url}/{datetime_now}/{parameters}/{location}/json'

response = requests.get(url, auth=(username, password))

app = FastAPI()
client = Client()

if response.status_code == 200:
    data = response.json()
    # print(json.dumps(data, indent=4))
    for item in data['data']:
        for name in dataDict:
            if name['name'] == item['parameter']:
                name['value'] = item['coordinates'][0]['dates'][0]['value']                

else:
    print(f'Error: {response.status_code} - {response.text}')




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


    modified_query = f"Provide results in simple language without special characters. As an agriculture and environmental science expert, analyze the parameters and answer '{query}' without including ranges. Wind speed {dataDict[0]['value']} m/s: no impact (0-3), minor (3-6), moderate (6-10), severe (>10). Sea level pressure {dataDict[1]['value']} hPa: fair (>1020), storms (<1000). Soil moisture deficit {dataDict[2]['value']} mm: adequate (0-25), moderate (25-100), urgent irrigation (>100). Evapotranspiration {dataDict[3]['value']} mm/day: no extra (0-2), normal (2-8), intensive (>8). Air quality index {dataDict[4]['value']}: good (0-50), moderate (50-100), poor (>300). PM2.5 {dataDict[5]['value']} µg/m³: safe (0-10), harmful (>75). Forest fire warnings {dataDict[6]['value']}: low risk (0-0.3), high risk (0.7-1.0). Rain warnings {dataDict[7]['value']}: no risk (0), severe flooding (3). Provide risks and preventive measures for the requested parameters; if missing, output 'not in database'."



    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": f"{modified_query}"}],
    )
    message = response.choices[0].message.content
    query = ""
    # print(f"{dataDict[0]['value']}")
    print('---------------------------------')
    for item in dataDict:
        print(item['name'])
        print(item['value'])
    # Return the processed data
    return {
        "original": query,
        "message": f"{message}."
    }
