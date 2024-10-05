import requests
import json

def fetch_nasa_power_data(latitude, longitude, start_date, end_date, parameters):
    """
    Fetches agroclimatology data from NASA's POWER API for a given location and time range.

    Parameters:
    - latitude (float): Latitude of the location.
    - longitude (float): Longitude of the location.
    - start_date (str): Start date in 'YYYYMMDD' format.
    - end_date (str): End date in 'YYYYMMDD' format.
    - parameters (list): List of parameter strings to fetch.

    Returns:
    - dict: JSON data returned from the API.
    """
    base_url = 'https://power.larc.nasa.gov/api/temporal/daily/point'

    params = {
        'latitude': latitude,
        'longitude': longitude,
        'start': start_date,
        'end': end_date,
        'parameters': ','.join(parameters),
        'community': 'AG',  # 'AG' for agroclimatology community
        'format': 'JSON',
        'user': 'anonymous'
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error fetching data: {response.status_code}")
        return None

def main():
    # Example usage
    latitude = 36.0          # Replace with the desired latitude
    longitude = -78.0        # Replace with the desired longitude
    start_date = '20230101'  # Start date in 'YYYYMMDD' format
    end_date = '20230110'    # End date in 'YYYYMMDD' format

    # Parameters to fetch (e.g., Temperature at 2 meters and Precipitation)
    parameters = ['T2M', 'PRECTOT']

    data = fetch_nasa_power_data(latitude, longitude, start_date, end_date, parameters)

    if data:
        # Pretty-print the JSON data
        print(json.dumps(data, indent=2))

if __name__ == '__main__':
    main()
