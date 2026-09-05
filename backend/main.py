from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(title="WeatherWise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def calculate_outdoor_intelligence(
    temperature,
    rain_probability,
    wind_speed,
    uv_index,
):
    score = 100

    if temperature >= 38:
        score -= 35
    elif temperature >= 34:
        score -= 20
    elif temperature >= 30:
        score -= 10
    elif temperature < 10:
        score -= 20

    if rain_probability >= 70:
        score -= 35
    elif rain_probability >= 50:
        score -= 25
    elif rain_probability >= 30:
        score -= 10

    if wind_speed >= 35:
        score -= 30
    elif wind_speed >= 25:
        score -= 20
    elif wind_speed >= 15:
        score -= 10

    if uv_index >= 8:
        score -= 20
    elif uv_index >= 6:
        score -= 10

    score = max(0, min(100, score))

    if score >= 75:
        status = "Great"
        message = "Comfortable conditions with low weather-related risk."
    elif score >= 50:
        status = "Moderate"
        message = "Outdoor activities are possible, but some precautions are recommended."
    elif score >= 25:
        status = "Fair"
        message = "Conditions may be uncomfortable. Check the forecast before going out."
    else:
        status = "Poor"
        message = "Weather conditions are not ideal for outdoor activities right now."

    return {
        "score": score,
        "status": status,
        "message": message,
    }


def get_air_quality_status(aqi):
    if aqi <= 50:
        return {
            "status": "Good",
            "message": "Air quality is good and generally suitable for outdoor activities.",
        }
    elif aqi <= 100:
        return {
            "status": "Moderate",
            "message": "Air quality is acceptable, but unusually sensitive people may want to reduce prolonged exposure.",
        }
    elif aqi <= 150:
        return {
            "status": "Unhealthy for Sensitive Groups",
            "message": "Sensitive individuals should consider reducing prolonged or intense outdoor activity.",
        }
    elif aqi <= 200:
        return {
            "status": "Unhealthy",
            "message": "Everyone may begin to experience health effects. Consider reducing prolonged outdoor activity.",
        }
    elif aqi <= 300:
        return {
            "status": "Very Unhealthy",
            "message": "Health alert conditions. Outdoor exposure should be reduced.",
        }
    else:
        return {
            "status": "Hazardous",
            "message": "Health warnings are likely. Avoid prolonged outdoor exposure.",
        }


@app.get("/")
def root():
    return {"message": "WeatherWise backend is running"}


@app.get("/api/weather")
def get_weather(latitude: float, longitude: float):
    weather_url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ",".join([
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "rain",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m",
            "wind_gusts_10m",
            "uv_index",
        ]),
        "hourly": ",".join([
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation_probability",
            "weather_code",
            "wind_speed_10m",
            "uv_index",
        ]),
        "daily": ",".join([
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
            "weather_code",
            "sunrise",
            "sunset",
            "wind_speed_10m_max",
        ]),
        "timezone": "auto",
        "forecast_days": 7,
    }

    try:
        response = requests.get(
            weather_url,
            params=params,
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Weather API request failed: {exc}",
        )

    current = data.get("current", {})
    hourly = data.get("hourly", {})

    temperature = current.get("temperature_2m", 0)
    rain_probability = (
        hourly.get("precipitation_probability", [0])[0]
        if hourly.get("precipitation_probability")
        else 0
    )
    wind_speed = current.get("wind_speed_10m", 0)
    uv_index = current.get("uv_index", 0)

    outdoor = calculate_outdoor_intelligence(
        temperature,
        rain_probability,
        wind_speed,
        uv_index,
    )

    return {
        "latitude": data["latitude"],
        "longitude": data["longitude"],
        "timezone": data["timezone"],
        "current": current,
        "hourly": hourly,
        "daily": data.get("daily", {}),
        "intelligence": {
            "outdoor": outdoor,
        },
    }


@app.get("/api/location")
def get_location(latitude: float, longitude: float):
    location_url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "jsonv2",
        "zoom": 10,
        "addressdetails": 1,
    }

    headers = {
        "User-Agent": "WeatherWise/1.0",
    }

    try:
        response = requests.get(
            location_url,
            params=params,
            headers=headers,
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Location API request failed: {exc}",
        )

    address = data.get("address", {})

    return {
        "city": (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or address.get("municipality")
        ),
        "state": address.get("state"),
        "country": address.get("country"),
        "display_name": data.get("display_name"),
        "latitude": latitude,
        "longitude": longitude,
    }


@app.get("/api/air-quality")
def get_air_quality(latitude: float, longitude: float):
    air_quality_url = (
        "https://air-quality-api.open-meteo.com/v1/air-quality"
    )

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ",".join([
            "us_aqi",
            "us_aqi_pm2_5",
            "us_aqi_pm10",
            "pm2_5",
            "pm10",
            "ozone",
            "nitrogen_dioxide",
        ]),
        "timezone": "auto",
    }

    try:
        response = requests.get(
            air_quality_url,
            params=params,
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Air quality API request failed: {exc}",
        )

    current = data.get("current", {})
    aqi = current.get("us_aqi")

    if aqi is None:
        raise HTTPException(
            status_code=502,
            detail="Air quality API did not return US AQI.",
        )

    air_status = get_air_quality_status(aqi)

    return {
        "latitude": data["latitude"],
        "longitude": data["longitude"],
        "timezone": data["timezone"],
        "current": current,
        "intelligence": {
            "aqi": {
                "value": round(aqi),
                "status": air_status["status"],
                "message": air_status["message"],
            }
        },
    }

# =========================================
# SEVERE WEATHER ALERT ENGINE
# Add this function + endpoint to backend/main.py
# =========================================

def build_weather_alerts(weather_data, air_quality_data=None):
    alerts = []
    current = weather_data.get("current", {})
    hourly = weather_data.get("hourly", {})
    daily = weather_data.get("daily", {})

    temperature = current.get("temperature_2m")
    wind = current.get("wind_speed_10m")
    wind_gust = current.get("wind_gusts_10m")
    uv = current.get("uv_index")

    rain_probs = hourly.get("precipitation_probability", []) or []
    weather_codes = hourly.get("weather_code", []) or []

    max_rain = max(rain_probs[:12], default=0)
    max_wind = max(hourly.get("wind_speed_10m", [])[:12], default=wind or 0)

    if temperature is not None and temperature >= 40:
        alerts.append({
            "id": "extreme-heat",
            "type": "heat",
            "severity": "Critical",
            "title": "Extreme Heat Alert",
            "message": f"Temperature is around {round(temperature)}°C. Heat stress risk is elevated.",
            "action": "Avoid prolonged outdoor exposure, stay hydrated and prefer cooler hours.",
        })
    elif temperature is not None and temperature >= 35:
        alerts.append({
            "id": "high-heat",
            "type": "heat",
            "severity": "Warning",
            "title": "High Heat",
            "message": f"Temperature is around {round(temperature)}°C and may cause discomfort outdoors.",
            "action": "Limit strenuous activity during peak afternoon heat and stay hydrated.",
        })

    if max_rain >= 80:
        alerts.append({
            "id": "heavy-rain",
            "type": "rain",
            "severity": "Warning",
            "title": "Heavy Rain Risk",
            "message": f"Rain probability reaches {round(max_rain)}% in the next several hours.",
            "action": "Carry rain protection and consider delaying non-essential outdoor activities.",
        })
    elif max_rain >= 60:
        alerts.append({
            "id": "rain-risk",
            "type": "rain",
            "severity": "Watch",
            "title": "Rain Expected",
            "message": f"Rain probability reaches {round(max_rain)}% in the near-term forecast.",
            "action": "Keep rain protection ready and allow extra travel time.",
        })

    if max_wind >= 45 or (wind_gust is not None and wind_gust >= 55):
        alerts.append({
            "id": "strong-wind",
            "type": "wind",
            "severity": "Warning",
            "title": "Strong Wind Alert",
            "message": "Strong winds or gusts are possible in the near-term forecast.",
            "action": "Use caution around exposed areas and consider postponing vulnerable outdoor activities.",
        })
    elif max_wind >= 30:
        alerts.append({
            "id": "wind-watch",
            "type": "wind",
            "severity": "Watch",
            "title": "Elevated Wind",
            "message": "Wind speeds may make some outdoor activities uncomfortable.",
            "action": "Check wind conditions before cycling, boating or other exposed activities.",
        })

    if uv is not None and uv >= 11:
        alerts.append({
            "id": "extreme-uv",
            "type": "uv",
            "severity": "Critical",
            "title": "Extreme UV",
            "message": f"UV index is around {round(uv)}.",
            "action": "Avoid prolonged direct sun and use strong sun protection.",
        })
    elif uv is not None and uv >= 8:
        alerts.append({
            "id": "high-uv",
            "type": "uv",
            "severity": "Warning",
            "title": "Very High UV",
            "message": f"UV index is around {round(uv)}.",
            "action": "Limit peak-sun exposure and use shade, clothing and sunscreen.",
        })

    if any(code is not None and code >= 95 for code in weather_codes[:12]):
        alerts.append({
            "id": "thunderstorm",
            "type": "storm",
            "severity": "Warning",
            "title": "Thunderstorm Risk",
            "message": "Thunderstorm conditions appear in the near-term forecast.",
            "action": "Move indoors if thunder is heard and avoid exposed outdoor areas.",
        })

    if air_quality_data:
        aqi = air_quality_data.get("current", {}).get("us_aqi")
        if aqi is not None and aqi >= 151:
            alerts.append({
                "id": "poor-air",
                "type": "air",
                "severity": "Warning",
                "title": "Poor Air Quality",
                "message": f"US AQI is around {round(aqi)}.",
                "action": "Reduce prolonged outdoor exposure, especially for sensitive people.",
            })

    severity_order = {"Critical": 0, "Warning": 1, "Watch": 2}
    alerts.sort(key=lambda item: severity_order.get(item["severity"], 3))
    return alerts


@app.get("/api/alerts")
def get_alerts(latitude: float, longitude: float):
    weather_url = "https://api.open-meteo.com/v1/forecast"
    weather_params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ",".join([
            "temperature_2m",
            "wind_speed_10m",
            "wind_gusts_10m",
            "uv_index",
        ]),
        "hourly": ",".join([
            "precipitation_probability",
            "weather_code",
            "wind_speed_10m",
        ]),
        "daily": "weather_code,precipitation_probability_max",
        "timezone": "auto",
        "forecast_days": 2,
    }

    response = requests.get(weather_url, params=weather_params, timeout=10)
    response.raise_for_status()
    weather_data = response.json()

    air_quality_data = None
    try:
        aq_url = "https://air-quality-api.open-meteo.com/v1/air-quality"
        aq_params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "us_aqi",
            "timezone": "auto",
        }
        aq_response = requests.get(aq_url, params=aq_params, timeout=10)
        if aq_response.ok:
            air_quality_data = aq_response.json()
    except requests.RequestException:
        pass

    return {
        "latitude": weather_data.get("latitude"),
        "longitude": weather_data.get("longitude"),
        "timezone": weather_data.get("timezone"),
        "alerts": build_weather_alerts(weather_data, air_quality_data),
    }

# ---------------- EVENT PLANNER ----------------

from datetime import datetime, timedelta

def calculate_event_suitability(
    temperature,
    rain_probability,
    wind_speed,
    uv_index,
    setting="Outdoor",
):
    score = 100

    # Rain matters most for outdoor/mixed events.
    if setting in ("Outdoor", "Mixed"):
        if rain_probability >= 80:
            score -= 45
        elif rain_probability >= 60:
            score -= 35
        elif rain_probability >= 40:
            score -= 20
        elif rain_probability >= 25:
            score -= 10

    if temperature >= 40:
        score -= 35
    elif temperature >= 36:
        score -= 25
    elif temperature >= 32:
        score -= 12
    elif temperature < 10:
        score -= 20

    if wind_speed >= 40:
        score -= 30
    elif wind_speed >= 30:
        score -= 20
    elif wind_speed >= 20:
        score -= 10

    if setting in ("Outdoor", "Mixed"):
        if uv_index >= 9:
            score -= 18
        elif uv_index >= 7:
            score -= 10

    # Indoor events are much less sensitive to rain/UV.
    score = max(0, min(100, round(score)))

    if score >= 75:
        status = "Good"
        message = "Weather conditions look favorable for this event."
    elif score >= 50:
        status = "Moderate"
        message = "The event is possible, but weather-related precautions are recommended."
    elif score >= 25:
        status = "Risky"
        message = "Weather may disrupt the event. A backup plan is strongly recommended."
    else:
        status = "Poor"
        message = "Weather conditions are unfavorable. Consider changing the timing or venue."

    return score, status, message


@app.get("/api/event-analysis")
def analyze_event(
    latitude: float,
    longitude: float,
    date: str,
    time: str,
    duration: int = 3,
    setting: str = "Outdoor",
):
    # Reuse Open-Meteo forecast data. The endpoint requests hourly data for the
    # event date so the recommendation is based on actual forecast variables.
    weather_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ",".join([
            "temperature_2m",
            "precipitation_probability",
            "wind_speed_10m",
            "uv_index",
            "weather_code",
        ]),
        "timezone": "auto",
        "start_date": date,
        "end_date": date,
    }

    response = requests.get(weather_url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()

    hourly = data.get("hourly", {})
    times = hourly.get("time", [])

    if not times:
        return {
            "status": "Unavailable",
            "risk_score": None,
            "message": "No forecast is available for this event date.",
            "recommendations": [],
        }

    target = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    selected_indices = []

    # Analyze the event window at hourly resolution.
    for i, value in enumerate(times):
        try:
            forecast_time = datetime.fromisoformat(value)
            if target <= forecast_time < target + timedelta(hours=int(duration)):
                selected_indices.append(i)
        except ValueError:
            continue

    if not selected_indices:
        # Find the closest forecast hour if the requested time is not an exact
        # hourly timestamp.
        parsed_times = [datetime.fromisoformat(x) for x in times]
        closest = min(range(len(parsed_times)), key=lambda i: abs(parsed_times[i] - target))
        selected_indices = [closest]

    def values(key):
        return [
            hourly[key][i]
            for i in selected_indices
            if key in hourly and hourly[key][i] is not None
        ]

    temperatures = values("temperature_2m")
    rains = values("precipitation_probability")
    winds = values("wind_speed_10m")
    uvs = values("uv_index")

    temperature = round(sum(temperatures) / len(temperatures), 1) if temperatures else None
    rain_probability = round(max(rains)) if rains else 0
    wind_speed = round(max(winds), 1) if winds else 0
    uv_index = round(max(uvs), 1) if uvs else 0

    score, status, message = calculate_event_suitability(
        temperature or 25,
        rain_probability,
        wind_speed,
        uv_index,
        setting,
    )

    recommendations = []

    if setting in ("Outdoor", "Mixed") and rain_probability >= 40:
        recommendations.append("Keep a covered or indoor backup because rain risk is elevated.")

    if temperature is not None and temperature >= 35:
        recommendations.append("Provide shade, drinking water, and cooling areas because of high heat.")

    if wind_speed >= 30:
        recommendations.append("Secure temporary structures, decorations, and lightweight equipment.")

    if setting in ("Outdoor", "Mixed") and uv_index >= 7:
        recommendations.append("Provide shade and encourage sun protection during high-UV periods.")

    if not recommendations:
        recommendations.append("Current forecast does not indicate a major weather-related disruption.")

    return {
        "date": date,
        "time": time,
        "duration": duration,
        "setting": setting,
        "risk_score": score,
        "status": status,
        "message": message,
        "metrics": {
            "temperature": temperature,
            "rain_probability": rain_probability,
            "wind_speed": wind_speed,
            "uv_index": uv_index,
        },
        "recommendations": recommendations,
    }

# ---------------- TRAVEL PLANNER ----------------

@app.get("/api/geocode")
def geocode_city(city: str):
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json",
    }
    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()
    results = data.get("results", [])

    if not results:
        raise HTTPException(status_code=404, detail="Destination not found")

    place = results[0]
    return {
        "name": place.get("name"),
        "country": place.get("country"),
        "latitude": place["latitude"],
        "longitude": place["longitude"],
    }


def travel_weather_label(code):
    try:
        code = int(code)
    except (TypeError, ValueError):
        return "Variable weather"

    if code == 0:
        return "Clear sky"
    if code in (1, 2, 3):
        return "Partly cloudy"
    if code in (45, 48):
        return "Foggy"
    if code in (51, 53, 55, 56, 57):
        return "Drizzle"
    if code in (61, 63, 65, 66, 67):
        return "Rain"
    if code in (71, 73, 75, 77):
        return "Snow"
    if code in (80, 81, 82):
        return "Rain showers"
    if code in (85, 86):
        return "Snow showers"
    if code in (95, 96, 99):
        return "Thunderstorm"
    return "Variable weather"


def build_travel_advice(
    trip_type,
    avg_temperature,
    max_rain_probability,
    max_wind_speed,
    max_uv_index,
):
    packing = []
    advice = []

    if max_rain_probability >= 40:
        packing.append("Umbrella or compact rain jacket")
        packing.append("Water-resistant footwear")
        advice.append("Keep outdoor activities flexible because rain is possible.")

    if avg_temperature >= 32:
        packing.append("Light, breathable clothing")
        packing.append("Sunglasses and sunscreen")
        advice.append("Plan strenuous sightseeing for cooler morning or evening hours.")
    elif avg_temperature <= 15:
        packing.append("Warm layers")
        advice.append("Carry an extra layer for early mornings and evenings.")
    else:
        packing.append("Comfortable daywear with one light layer")

    if max_uv_index >= 7:
        packing.append("Sunscreen and a hat")
        advice.append("Use shade and sun protection during peak UV hours.")

    if max_wind_speed >= 30:
        advice.append("Check local conditions before exposed outdoor or water activities.")

    if trip_type == "Beach":
        packing.append("Swimwear and a beach cover-up")
        if max_wind_speed >= 25:
            advice.append("Check local beach and water conditions before entering the water.")

    elif trip_type == "Adventure":
        packing.append("Comfortable walking shoes")
        advice.append("Avoid exposed activities if thunderstorms or strong winds develop.")

    elif trip_type == "Road Trip":
        packing.append("Light travel essentials and water")
        advice.append("Check visibility and rain conditions before long drives.")

    elif trip_type == "Family":
        packing.append("Basic essentials for children")
        advice.append("Keep an indoor backup activity if rain risk increases.")

    elif trip_type == "Business":
        packing.append("One weather-appropriate formal layer")
        advice.append("Allow extra travel time if rain or poor visibility is forecast.")

    if not packing:
        packing.append("Weather-appropriate clothing")

    if not advice:
        advice.append("Forecast conditions look broadly manageable for this trip.")

    return packing, advice


@app.get("/api/travel-analysis")
def analyze_travel(
    latitude: float,
    longitude: float,
    date: str,
    days: int = 2,
    trip_type: str = "Sightseeing",
):
    days = max(1, min(int(days), 7))

    weather_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ",".join([
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
            "weather_code",
            "wind_speed_10m_max",
            "uv_index_max",
            "sunrise",
            "sunset",
        ]),
        "timezone": "auto",
        "start_date": date,
        "end_date": (
            datetime.strptime(date, "%Y-%m-%d") + timedelta(days=days - 1)
        ).strftime("%Y-%m-%d"),
    }

    response = requests.get(weather_url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()
    daily = data.get("daily", {})

    dates = daily.get("time", [])
    if not dates:
        return {
            "status": "Unavailable",
            "risk_score": None,
            "message": "No forecast is available for this destination and date.",
            "daily": [],
            "packing": [],
            "advice": [],
        }

    temps_max = daily.get("temperature_2m_max", [])
    temps_min = daily.get("temperature_2m_min", [])
    rains = daily.get("precipitation_probability_max", [])
    winds = daily.get("wind_speed_10m_max", [])
    uvs = daily.get("uv_index_max", [])
    codes = daily.get("weather_code", [])

    valid = lambda arr: [x for x in arr if x is not None]

    all_max = valid(temps_max)
    all_min = valid(temps_min)
    all_rain = valid(rains)
    all_wind = valid(winds)
    all_uv = valid(uvs)

    avg_temperature = (
        round((sum(all_max) + sum(all_min)) / (len(all_max) + len(all_min)), 1)
        if all_max and all_min else None
    )
    max_rain = round(max(all_rain)) if all_rain else 0
    max_wind = round(max(all_wind), 1) if all_wind else 0
    max_uv = round(max(all_uv), 1) if all_uv else 0

    score = 100

    if max_rain >= 80:
        score -= 35
    elif max_rain >= 60:
        score -= 25
    elif max_rain >= 40:
        score -= 15
    elif max_rain >= 25:
        score -= 7

    if avg_temperature is not None:
        if avg_temperature >= 40:
            score -= 30
        elif avg_temperature >= 36:
            score -= 20
        elif avg_temperature >= 33:
            score -= 10
        elif avg_temperature <= 8:
            score -= 20

    if max_wind >= 40:
        score -= 25
    elif max_wind >= 30:
        score -= 15
    elif max_wind >= 20:
        score -= 7

    if max_uv >= 9:
        score -= 15
    elif max_uv >= 7:
        score -= 8

    score = max(0, min(100, round(score)))

    if score >= 75:
        status = "Good"
        message = "Forecast conditions look favorable for this trip."
    elif score >= 50:
        status = "Moderate"
        message = "The trip is feasible, but some weather-related planning is recommended."
    elif score >= 25:
        status = "Risky"
        message = "Weather may affect your plans. Keep alternatives available."
    else:
        status = "Poor"
        message = "Weather conditions are unfavorable. Consider changing dates or plans."

    daily_outlook = []
    best_index = None
    best_day_score = -1

    for i, day in enumerate(dates):
        day_rain = rains[i] if i < len(rains) and rains[i] is not None else 0
        day_wind = winds[i] if i < len(winds) and winds[i] is not None else 0
        day_max = temps_max[i] if i < len(temps_max) and temps_max[i] is not None else None
        day_min = temps_min[i] if i < len(temps_min) and temps_min[i] is not None else None
        day_uv = uvs[i] if i < len(uvs) and uvs[i] is not None else 0
        day_score = 100 - min(45, day_rain * 0.45) - min(25, max(0, day_wind - 15) * 1.0)

        if day_max is not None and day_max >= 36:
            day_score -= 15
        if day_uv >= 8:
            day_score -= 8

        day_score = max(0, day_score)

        if day_score > best_day_score:
            best_day_score = day_score
            best_index = i

        daily_outlook.append({
            "date": day,
            "max_temperature": round(day_max, 1) if day_max is not None else "—",
            "min_temperature": round(day_min, 1) if day_min is not None else "—",
            "rain_probability": round(day_rain),
            "wind_speed": round(day_wind, 1),
            "uv_index": round(day_uv, 1),
            "weather": travel_weather_label(codes[i] if i < len(codes) else None),
        })

    packing, advice = build_travel_advice(
        trip_type,
        avg_temperature or 25,
        max_rain,
        max_wind,
        max_uv,
    )

    best_day = None
    if best_index is not None:
        best_day = {
            "date": dates[best_index],
            "reason": "This day has the most favorable combination of rain, wind, temperature, and UV conditions in your trip window.",
        }

    return {
        "date": date,
        "days": days,
        "trip_type": trip_type,
        "risk_score": score,
        "status": status,
        "message": message,
        "summary": {
            "avg_temperature": avg_temperature,
            "max_rain_probability": max_rain,
            "max_wind_speed": max_wind,
            "max_uv_index": max_uv,
        },
        "daily": daily_outlook,
        "packing": packing,
        "advice": advice,
        "best_day": best_day,
    }

# ---------------- TRAVEL PLANNER ----------------

@app.get("/api/geocode")
def geocode_city(city: str):
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json",
    }
    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()
    results = data.get("results", [])

    if not results:
        raise HTTPException(status_code=404, detail="Destination not found")

    place = results[0]
    return {
        "name": place.get("name"),
        "country": place.get("country"),
        "latitude": place["latitude"],
        "longitude": place["longitude"],
    }


def travel_weather_label(code):
    try:
        code = int(code)
    except (TypeError, ValueError):
        return "Variable weather"

    if code == 0:
        return "Clear sky"
    if code in (1, 2, 3):
        return "Partly cloudy"
    if code in (45, 48):
        return "Foggy"
    if code in (51, 53, 55, 56, 57):
        return "Drizzle"
    if code in (61, 63, 65, 66, 67):
        return "Rain"
    if code in (71, 73, 75, 77):
        return "Snow"
    if code in (80, 81, 82):
        return "Rain showers"
    if code in (85, 86):
        return "Snow showers"
    if code in (95, 96, 99):
        return "Thunderstorm"
    return "Variable weather"


def build_travel_advice(
    trip_type,
    avg_temperature,
    max_rain_probability,
    max_wind_speed,
    max_uv_index,
):
    packing = []
    advice = []

    if max_rain_probability >= 40:
        packing.append("Umbrella or compact rain jacket")
        packing.append("Water-resistant footwear")
        advice.append("Keep outdoor activities flexible because rain is possible.")

    if avg_temperature >= 32:
        packing.append("Light, breathable clothing")
        packing.append("Sunglasses and sunscreen")
        advice.append("Plan strenuous sightseeing for cooler morning or evening hours.")
    elif avg_temperature <= 15:
        packing.append("Warm layers")
        advice.append("Carry an extra layer for early mornings and evenings.")
    else:
        packing.append("Comfortable daywear with one light layer")

    if max_uv_index >= 7:
        packing.append("Sunscreen and a hat")
        advice.append("Use shade and sun protection during peak UV hours.")

    if max_wind_speed >= 30:
        advice.append("Check local conditions before exposed outdoor or water activities.")

    if trip_type == "Beach":
        packing.append("Swimwear and a beach cover-up")
        if max_wind_speed >= 25:
            advice.append("Check local beach and water conditions before entering the water.")

    elif trip_type == "Adventure":
        packing.append("Comfortable walking shoes")
        advice.append("Avoid exposed activities if thunderstorms or strong winds develop.")

    elif trip_type == "Road Trip":
        packing.append("Light travel essentials and water")
        advice.append("Check visibility and rain conditions before long drives.")

    elif trip_type == "Family":
        packing.append("Basic essentials for children")
        advice.append("Keep an indoor backup activity if rain risk increases.")

    elif trip_type == "Business":
        packing.append("One weather-appropriate formal layer")
        advice.append("Allow extra travel time if rain or poor visibility is forecast.")

    if not packing:
        packing.append("Weather-appropriate clothing")

    if not advice:
        advice.append("Forecast conditions look broadly manageable for this trip.")

    return packing, advice


@app.get("/api/travel-analysis")
def analyze_travel(
    latitude: float,
    longitude: float,
    date: str,
    days: int = 2,
    trip_type: str = "Sightseeing",
):
    days = max(1, min(int(days), 7))

    weather_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ",".join([
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
            "weather_code",
            "wind_speed_10m_max",
            "uv_index_max",
            "sunrise",
            "sunset",
        ]),
        "timezone": "auto",
        "start_date": date,
        "end_date": (
            datetime.strptime(date, "%Y-%m-%d") + timedelta(days=days - 1)
        ).strftime("%Y-%m-%d"),
    }

    response = requests.get(weather_url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()
    daily = data.get("daily", {})

    dates = daily.get("time", [])
    if not dates:
        return {
            "status": "Unavailable",
            "risk_score": None,
            "message": "No forecast is available for this destination and date.",
            "daily": [],
            "packing": [],
            "advice": [],
        }

    temps_max = daily.get("temperature_2m_max", [])
    temps_min = daily.get("temperature_2m_min", [])
    rains = daily.get("precipitation_probability_max", [])
    winds = daily.get("wind_speed_10m_max", [])
    uvs = daily.get("uv_index_max", [])
    codes = daily.get("weather_code", [])

    valid = lambda arr: [x for x in arr if x is not None]

    all_max = valid(temps_max)
    all_min = valid(temps_min)
    all_rain = valid(rains)
    all_wind = valid(winds)
    all_uv = valid(uvs)

    avg_temperature = (
        round((sum(all_max) + sum(all_min)) / (len(all_max) + len(all_min)), 1)
        if all_max and all_min else None
    )
    max_rain = round(max(all_rain)) if all_rain else 0
    max_wind = round(max(all_wind), 1) if all_wind else 0
    max_uv = round(max(all_uv), 1) if all_uv else 0

    score = 100

    if max_rain >= 80:
        score -= 35
    elif max_rain >= 60:
        score -= 25
    elif max_rain >= 40:
        score -= 15
    elif max_rain >= 25:
        score -= 7

    if avg_temperature is not None:
        if avg_temperature >= 40:
            score -= 30
        elif avg_temperature >= 36:
            score -= 20
        elif avg_temperature >= 33:
            score -= 10
        elif avg_temperature <= 8:
            score -= 20

    if max_wind >= 40:
        score -= 25
    elif max_wind >= 30:
        score -= 15
    elif max_wind >= 20:
        score -= 7

    if max_uv >= 9:
        score -= 15
    elif max_uv >= 7:
        score -= 8

    score = max(0, min(100, round(score)))

    if score >= 75:
        status = "Good"
        message = "Forecast conditions look favorable for this trip."
    elif score >= 50:
        status = "Moderate"
        message = "The trip is feasible, but some weather-related planning is recommended."
    elif score >= 25:
        status = "Risky"
        message = "Weather may affect your plans. Keep alternatives available."
    else:
        status = "Poor"
        message = "Weather conditions are unfavorable. Consider changing dates or plans."

    daily_outlook = []
    best_index = None
    best_day_score = -1

    for i, day in enumerate(dates):
        day_rain = rains[i] if i < len(rains) and rains[i] is not None else 0
        day_wind = winds[i] if i < len(winds) and winds[i] is not None else 0
        day_max = temps_max[i] if i < len(temps_max) and temps_max[i] is not None else None
        day_min = temps_min[i] if i < len(temps_min) and temps_min[i] is not None else None
        day_uv = uvs[i] if i < len(uvs) and uvs[i] is not None else 0
        day_score = 100 - min(45, day_rain * 0.45) - min(25, max(0, day_wind - 15) * 1.0)

        if day_max is not None and day_max >= 36:
            day_score -= 15
        if day_uv >= 8:
            day_score -= 8

        day_score = max(0, day_score)

        if day_score > best_day_score:
            best_day_score = day_score
            best_index = i

        daily_outlook.append({
            "date": day,
            "max_temperature": round(day_max, 1) if day_max is not None else "—",
            "min_temperature": round(day_min, 1) if day_min is not None else "—",
            "rain_probability": round(day_rain),
            "wind_speed": round(day_wind, 1),
            "uv_index": round(day_uv, 1),
            "weather": travel_weather_label(codes[i] if i < len(codes) else None),
        })

    packing, advice = build_travel_advice(
        trip_type,
        avg_temperature or 25,
        max_rain,
        max_wind,
        max_uv,
    )

    best_day = None
    if best_index is not None:
        best_day = {
            "date": dates[best_index],
            "reason": "This day has the most favorable combination of rain, wind, temperature, and UV conditions in your trip window.",
        }

    return {
        "date": date,
        "days": days,
        "trip_type": trip_type,
        "risk_score": score,
        "status": status,
        "message": message,
        "summary": {
            "avg_temperature": avg_temperature,
            "max_rain_probability": max_rain,
            "max_wind_speed": max_wind,
            "max_uv_index": max_uv,
        },
        "daily": daily_outlook,
        "packing": packing,
        "advice": advice,
        "best_day": best_day,
    }
