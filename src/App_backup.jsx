import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Menu,
  Sun,
  Wind,
  CloudRain,
  HeartPulse,
  Plane,
  CalendarDays,
  Tractor,
  BriefcaseBusiness,
  Users,
  Flower2,
  ShieldAlert,
  Wind as AirIcon,
  Bell,
  Sparkles,
  MessageCircle,
  Navigation,
  LoaderCircle,
  Bookmark,
  Clock3,
  Activity,
  Thermometer,
} from "lucide-react";

import "./App.css";

const cityWeather = {
  rishikesh: {
    city: "Rishikesh",
    temperature: 29,
    rain: 10,
    outdoor: "Great",
    uv: "High",
    wind: 12,
  },
  delhi: {
    city: "Delhi",
    temperature: 34,
    rain: 20,
    outdoor: "Moderate",
    uv: "Very High",
    wind: 15,
  },
  mumbai: {
    city: "Mumbai",
    temperature: 30,
    rain: 60,
    outdoor: "Fair",
    uv: "High",
    wind: 18,
  },
  bangalore: {
    city: "Bangalore",
    temperature: 26,
    rain: 35,
    outdoor: "Excellent",
    uv: "Moderate",
    wind: 10,
  },
  london: {
    city: "London",
    temperature: 17,
    rain: 55,
    outdoor: "Fair",
    uv: "Low",
    wind: 14,
  },
};

function WeatherItem({ icon, label, value }) {


  return (
    <div className="weather-item">
      <div className="weather-item-icon">{icon}</div>

      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function PlanningCard({ icon, title, text, onClick }) {
  return (
    <div className="planning-card">
      <div className="planning-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>

      <button type="button" onClick={onClick}>Explore →</button>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-item">
      <div className="feature-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function MiniProfile({ icon, title, text }) {
  return (
    <div className="mini-profile">
      <div className="mini-profile-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function getWeatherIcon(weatherCode) {
  if (weatherCode === 0) {
    return <Sun size={25} />;
  }

  if (weatherCode >= 1 && weatherCode <= 3) {
    return <CloudRain size={25} />;
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return <CloudRain size={25} />;
  }

  if (weatherCode >= 51 && weatherCode <= 67) {
    return <CloudRain size={25} />;
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return <CloudRain size={25} />;
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    return <CloudRain size={25} />;
  }

  if (weatherCode >= 95) {
    return <CloudRain size={25} />;
  }

  return <Sun size={25} />;
}

function HealthAirQuality({ airQuality, weather }) {
  if (!airQuality) return null;

  const aqi = airQuality.intelligence?.aqi;
  const current = airQuality.current;

  if (!aqi || !current) return null;

  return (
    <div className="health-section" id="health-insights">
      <div className="health-heading">
        <div>
          <p className="eyebrow">HEALTH & AIR QUALITY</p>
          <h3>Understand the air around you.</h3>
        </div>
      </div>

      <div className="health-card">
        <div className="aqi-main">
          <div className="aqi-label">Air Quality</div>
          <div className="aqi-value">{aqi.value}</div>
          <div className="aqi-status">{aqi.status}</div>
        </div>

        <div className="air-data-grid">
          <div className="air-data-item"><span>PM2.5</span><strong>{current.pm2_5 != null ? `${current.pm2_5.toFixed(1)} µg/m³` : '--'}</strong></div>
          <div className="air-data-item"><span>PM10</span><strong>{current.pm10 != null ? `${current.pm10.toFixed(1)} µg/m³` : '--'}</strong></div>
          <div className="air-data-item"><span>Humidity</span><strong>{weather?.relative_humidity_2m != null ? `${weather.relative_humidity_2m}%` : '--'}</strong></div>
          <div className="air-data-item"><span>UV Index</span><strong>{weather?.uv_index != null ? weather.uv_index : '--'}</strong></div>
        </div>

        <div className="health-insight">
          <div className="health-insight-icon"><HeartPulse size={20} /></div>
          <div><strong>Health Insight</strong><p>{aqi.message}</p></div>
        </div>
      </div>
    </div>
  );
}

function ForecastCard({ daily }) {
  if (!daily || !daily.time) {
    return null;
  }

  // Open-Meteo's first daily entry is TODAY.
  const getDayName = (dateString, index) => {
    if (index === 0) {
      return "Today";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  // Reverse the forecast visually:
  // 7th day → 6th day → ... → 2nd day → Today
  const forecastDays = daily.time
    .map((date, index) => ({
      date,
      index,
    }))
    .reverse();

  return (
    <div className="forecast-section">
      <div className="forecast-heading">
        <div>
          <p className="eyebrow">7-DAY FORECAST</p>
          <h3>What the week looks like.</h3>
        </div>
      </div>

      <div className="forecast-grid">
        {forecastDays.map(({ date, index }) => {
          const isToday = index === 0;

          return (
            <div
              className={`forecast-card ${
                isToday ? "forecast-today" : ""
              }`}
              key={date}
            >
              <div className="forecast-day">
                {getDayName(date, index)}
              </div>

              <div className="forecast-icon">
                {getWeatherIcon(daily.weather_code[index])}
              </div>

              <div className="forecast-temperature">
                <strong>
                  {Math.round(daily.temperature_2m_max[index])}°
                </strong>

                <span>
                  {Math.round(daily.temperature_2m_min[index])}°
                </span>
              </div>

              <div className="forecast-rain">
                <CloudRain size={15} />
                {Math.round(
                  daily.precipitation_probability_max[index]
                )}
                %
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OutdoorPlanner({ hourly }) {
  if (!hourly || !hourly.time || !hourly.temperature_2m) {
    return null;
  }

  // Open-Meteo starts the hourly forecast around the current hour.
  // We use the first 8 upcoming entries for the visible planner
  // and scan today's available hourly data to find the best hour.
  const hours = hourly.time
    .map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[index],
      rain: hourly.precipitation_probability?.[index] ?? 0,
      wind: hourly.wind_speed_10m?.[index] ?? 0,
      uv: hourly.uv_index?.[index] ?? 0,
    }))
    .filter((item) => item.temperature != null);

  if (!hours.length) {
    return null;
  }

  const scoreHour = (item) => {
    let score = 100;
    const temp = item.temperature;
    const rain = item.rain;
    const wind = item.wind;
    const uv = item.uv;

    if (temp >= 38) score -= 35;
    else if (temp >= 34) score -= 22;
    else if (temp >= 30) score -= 10;
    else if (temp < 10) score -= 20;
    else if (temp < 15) score -= 8;

    if (rain >= 70) score -= 40;
    else if (rain >= 50) score -= 28;
    else if (rain >= 30) score -= 12;

    if (wind >= 35) score -= 30;
    else if (wind >= 25) score -= 20;
    else if (wind >= 15) score -= 8;

    if (uv >= 8) score -= 20;
    else if (uv >= 6) score -= 10;

    return Math.max(0, Math.min(100, score));
  };

  const scoredHours = hours.map((item) => ({
    ...item,
    score: scoreHour(item),
  }));

  const bestHour = [...scoredHours].sort(
    (a, b) => b.score - a.score
  )[0];

  const displayHours = scoredHours.slice(0, 8);

  const formatHour = (time) => {
    const clock = time.slice(11, 16);
    const [hourString, minute] = clock.split(":");
    let hour = Number(hourString);

    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
  };

  const recommendation =
    bestHour.score >= 75
      ? "Great conditions for outdoor activity."
      : bestHour.score >= 50
      ? "Outdoor activity is possible with some precautions."
      : "Conditions are not ideal. Consider postponing outdoor activity.";

  return (
    <div className="outdoor-section">
      <div className="outdoor-heading">
        <div>
          <p className="eyebrow">OUTDOOR ACTIVITY</p>
          <h3>Find your best time to go outside.</h3>
        </div>
      </div>

      <div className="outdoor-recommendation">
        <div className="outdoor-recommendation-icon">
          <Activity size={23} />
        </div>

        <div className="outdoor-recommendation-copy">
          <span>BEST TIME TODAY</span>
          <strong>{formatHour(bestHour.time)}</strong>
          <p>
            {recommendation} WeatherWise gives this hour a{" "}
            <b>{bestHour.score}/100</b> outdoor score.
          </p>
        </div>

        <div className="outdoor-recommendation-data">
          <div>
            <Thermometer size={16} />
            {Math.round(bestHour.temperature)}°
          </div>

          <div>
            <CloudRain size={16} />
            {Math.round(bestHour.rain)}%
          </div>

          <div>
            <Wind size={16} />
            {Math.round(bestHour.wind)} km/h
          </div>
        </div>
      </div>

      <div className="hourly-card">
        <div className="hourly-card-heading">
          <div>
            <Clock3 size={18} />
            <strong>Upcoming hourly conditions</strong>
          </div>

          <span>Next 8 hours</span>
        </div>

        <div className="hourly-grid">
          {displayHours.map((item) => (
            <div
              className={`hour-card ${
                item.time === bestHour.time ? "hour-best" : ""
              }`}
              key={item.time}
            >
              <div className="hour-time">
                {formatHour(item.time)}
              </div>

              <div className="hour-temperature">
                {Math.round(item.temperature)}°
              </div>

              <div className="hour-detail">
                <CloudRain size={14} />
                {Math.round(item.rain)}%
              </div>

              <div className="hour-detail">
                <Wind size={14} />
                {Math.round(item.wind)} km/h
              </div>

              {item.time === bestHour.time && (
                <div className="best-label">BEST</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanningInsights({ selectedPlan, backendResponse, airQuality, weather }) {
  if (!selectedPlan) return null;

  const current = backendResponse?.current;
  const daily = backendResponse?.daily;

  const average = (values = []) => {
    const valid = values.filter((v) => typeof v === "number");
    if (!valid.length) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  };

  const getTravelStatus = () => {
    if (!current) return { label: "Load your location", text: "Use your current location to get live travel guidance." };
    const rain = backendResponse?.hourly?.precipitation_probability?.[0] ?? 0;
    const wind = current.wind_speed_10m ?? 0;
    const visibility = current.visibility;
    if (rain >= 70 || wind >= 35) return { label: "Plan with caution", text: "Rain or strong wind may affect travel. Check conditions before leaving." };
    if (rain >= 40 || wind >= 25) return { label: "Mostly manageable", text: "Travel is possible, but keep weather conditions in mind." };
    return { label: "Good for travel", text: "Current weather looks relatively comfortable for routine travel." };
  };

  const getEventStatus = () => {
    if (!daily?.time) return { label: "Load a forecast", text: "Use your current location to evaluate the next 7 days." };
    const rain = average(daily.precipitation_probability_max || []);
    const wind = average(daily.wind_speed_10m_max || []);
    if ((rain ?? 0) >= 60 || (wind ?? 0) >= 30) return { label: "Weather risk is elevated", text: "Consider an indoor backup plan for an outdoor event." };
    if ((rain ?? 0) >= 35 || (wind ?? 0) >= 20) return { label: "Plan with a backup", text: "Conditions are mixed across the forecast window." };
    return { label: "Favorable window", text: "The forecast looks relatively supportive for an outdoor event." };
  };

  const travel = getTravelStatus();
  const event = getEventStatus();

  return (
    <section className="planning-insights" id="planning-insights">
      {selectedPlan === "outdoors" && (
        <div className="planning-panel">
          <div className="planning-panel-copy">
            <p className="eyebrow">OUTDOORS</p>
            <h3>Find the best time to go outside.</h3>
            <p>WeatherWise scores upcoming hours using temperature, rain, wind and UV conditions.</p>
          </div>
          <OutdoorPlanner hourly={backendResponse?.hourly} />
        </div>
      )}

      {selectedPlan === "health" && (
        <div className="planning-panel">
          <div className="planning-panel-copy">
            <p className="eyebrow">HEALTH</p>
            <h3>Know how the weather may affect you.</h3>
            <p>Review air quality, particulate matter, humidity and UV before spending extended time outdoors.</p>
          </div>
          <HealthAirQuality airQuality={airQuality} weather={current} />
          {!airQuality && <div className="empty-plan">Use my current location to load live air-quality data.</div>}
        </div>
      )}

      {selectedPlan === "travel" && (
        <div className="planning-panel travel-panel">
          <div>
            <p className="eyebrow">TRAVEL</p>
            <h3>{travel.label}</h3>
            <p>{travel.text}</p>
          </div>
          <div className="decision-grid">
            <div><span>Temperature</span><strong>{current?.temperature_2m != null ? `${Math.round(current.temperature_2m)}°C` : "--"}</strong></div>
            <div><span>Rain chance</span><strong>{backendResponse?.hourly?.precipitation_probability?.[0] != null ? `${backendResponse.hourly.precipitation_probability[0]}%` : "--"}</strong></div>
            <div><span>Wind</span><strong>{current?.wind_speed_10m != null ? `${Math.round(current.wind_speed_10m)} km/h` : "--"}</strong></div>
            <div><span>UV index</span><strong>{current?.uv_index != null ? current.uv_index : "--"}</strong></div>
          </div>
          <div className="packing-tip"><strong>Quick packing tip</strong><p>{(backendResponse?.hourly?.precipitation_probability?.[0] ?? 0) >= 40 ? "Carry rain protection." : "Light weather protection should be enough for current conditions."}</p></div>
        </div>
      )}

      {selectedPlan === "events" && (
        <div className="planning-panel travel-panel">
          <div>
            <p className="eyebrow">EVENTS</p>
            <h3>{event.label}</h3>
            <p>{event.text}</p>
          </div>
          <div className="decision-grid">
            <div><span>Avg. rain chance</span><strong>{event.label === "Load a forecast" ? "--" : `${Math.round(average(daily?.precipitation_probability_max || []) ?? 0)}%`}</strong></div>
            <div><span>Peak wind</span><strong>{event.label === "Load a forecast" ? "--" : `${Math.round(Math.max(...(daily?.wind_speed_10m_max || [0])))} km/h`}</strong></div>
            <div><span>Forecast days</span><strong>{daily?.time?.length ?? "--"}</strong></div>
            <div><span>Outdoor plan</span><strong>{event.label === "Favorable window" ? "Yes" : "Backup"}</strong></div>
          </div>
        </div>
      )}
    </section>
  );
}


function ProfileIntelligence({ profile, backendResponse, airQuality }) {
  if (!profile || !backendResponse?.current) return null;

  const current = backendResponse.current;
  const hourly = backendResponse.hourly || {};
  const daily = backendResponse.daily || {};

  const firstRain = hourly.precipitation_probability?.[0] ?? 0;
  const firstTemp = current.temperature_2m ?? null;
  const humidity = current.relative_humidity_2m ?? null;
  const wind = current.wind_speed_10m ?? null;
  const uv = current.uv_index ?? null;
  const aqi = airQuality?.intelligence?.aqi?.value ?? null;
  const rainMax = Math.max(...(daily.precipitation_probability_max || [0]));
  const tempMax = Math.max(...(daily.temperature_2m_max || [0]));
  const tempMin = Math.min(...(daily.temperature_2m_min || [99]));
  const humidityAvg = (() => {
    const values = (hourly.relative_humidity_2m || []).filter((v) => typeof v === "number");
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
  })();

  const data = {
    farmer: {
      eyebrow: "FARMER INTELLIGENCE",
      title: "Weather for better field decisions.",
      metrics: [
        ["Rain chance", `${Math.round(rainMax)}%`],
        ["Max temperature", tempMax != null ? `${Math.round(tempMax)}°C` : "--"],
        ["Min temperature", tempMin !== 99 ? `${Math.round(tempMin)}°C` : "--"],
        ["Humidity", humidityAvg != null ? `${humidityAvg}%` : "--"],
      ],
      insight:
        rainMax >= 60
          ? "Rain is likely in the forecast. Consider delaying irrigation and weather-sensitive field operations."
          : tempMax >= 35
          ? "High temperatures are expected. Schedule demanding field work during cooler hours and monitor crop water needs."
          : "Weather conditions look relatively manageable. Review rainfall timing before irrigation or spraying.",
      actions: [
        firstRain >= 50 ? "Avoid unnecessary irrigation before expected rain." : "Review soil moisture before irrigation.",
        wind >= 25 ? "Strong wind may affect spraying and field operations." : "Wind conditions are currently manageable for routine work.",
        humidity >= 80 ? "High humidity can increase disease pressure in some crops." : "Humidity is not currently elevated.",
      ],
    },
    commute: {
      eyebrow: "SMART COMMUTE",
      title: "Weather-aware travel guidance.",
      metrics: [
        ["Temperature", firstTemp != null ? `${Math.round(firstTemp)}°C` : "--"],
        ["Rain chance", `${Math.round(firstRain)}%`],
        ["Wind", wind != null ? `${Math.round(wind)} km/h` : "--"],
        ["Visibility risk", firstRain >= 70 || wind >= 35 ? "Higher" : "Low"],
      ],
      insight:
        firstRain >= 70
          ? "High rain probability may slow your commute. Leave extra time and carry rain protection."
          : wind >= 30
          ? "Strong winds may affect travel comfort. Check road conditions before leaving."
          : "No major weather-related commute issue is indicated from the current conditions.",
      actions: [
        firstRain >= 40 ? "Carry rain protection." : "Rain protection is not essential based on the current hour.",
        wind >= 25 ? "Allow extra time if travelling on exposed roads." : "Wind conditions look manageable.",
        "Check live traffic separately before departure for the complete commute picture.",
      ],
    },
    family: {
      eyebrow: "FAMILY INTELLIGENCE",
      title: "Keep everyday plans weather-ready.",
      metrics: [
        ["Rain chance", `${Math.round(firstRain)}%`],
        ["AQI", aqi != null ? `${Math.round(aqi)} US AQI` : "--"],
        ["UV index", uv != null ? Math.round(uv) : "--"],
        ["Temperature", firstTemp != null ? `${Math.round(firstTemp)}°C` : "--"],
      ],
      insight:
        aqi != null && aqi > 100
          ? "Air quality may affect sensitive family members. Consider reducing prolonged outdoor exposure."
          : firstRain >= 60
          ? "Rain may affect school and outdoor plans. Keep a rain-ready commute plan."
          : uv >= 8
          ? "UV is high. Plan outdoor activities outside peak sun hours where possible."
          : "Conditions look generally manageable. Check alerts before school and outdoor plans.",
      actions: [
        aqi != null && aqi > 100 ? "Reduce prolonged outdoor activity for sensitive family members." : "Air quality is not currently a major concern.",
        firstRain >= 50 ? "Keep umbrellas or rain protection ready." : "No major rain preparation is indicated.",
        uv >= 6 ? "Use sun protection during extended outdoor activity." : "UV protection needs are relatively low.",
      ],
    },
    gardener: {
      eyebrow: "GARDEN INTELLIGENCE",
      title: "Weather guidance for plant care.",
      metrics: [
        ["Rain chance", `${Math.round(firstRain)}%`],
        ["Humidity", humidity != null ? `${Math.round(humidity)}%` : "--"],
        ["Temperature", firstTemp != null ? `${Math.round(firstTemp)}°C` : "--"],
        ["UV index", uv != null ? Math.round(uv) : "--"],
      ],
      insight:
        firstRain >= 60
          ? "Rain is likely. Consider postponing watering and checking drainage around plants."
          : firstTemp >= 34
          ? "Heat is elevated. Check soil moisture and water during cooler parts of the day."
          : "Garden conditions look relatively manageable. Use soil moisture and plant needs to guide watering.",
      actions: [
        firstRain >= 50 ? "Postpone routine watering if sufficient rain arrives." : "Check soil moisture before watering.",
        firstTemp >= 32 ? "Prefer early morning or evening watering." : "Normal watering timing should be reasonable.",
        humidity >= 80 ? "Monitor for excess moisture and fungal disease pressure." : "Humidity is not currently extreme.",
      ],
    },
  };

  const content = data[profile.id];
  if (!content) return null;

  return (
    <section className="profile-intelligence-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
        </div>
      </div>

      <div className="profile-intelligence-card">
        <div className="profile-intelligence-metrics">
          {content.metrics.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="profile-intelligence-insight">
          <div className="profile-insight-icon"><Sparkles size={21} /></div>
          <div>
            <strong>WeatherWise recommendation</strong>
            <p>{content.insight}</p>
          </div>
        </div>

        <div className="profile-intelligence-actions">
          {content.actions.map((action, index) => (
            <div key={index}>
              <span>✓</span>
              <p>{action}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SavedPlaces({ places, onSelect, onRemove, onClose }) {
  return (
    <div className="saved-panel-overlay" onClick={onClose}>
      <div className="saved-panel" onClick={(event) => event.stopPropagation()}>
        <div className="saved-panel-header">
          <div>
            <p className="eyebrow">YOUR PLACES</p>
            <h3>Saved Places</h3>
          </div>
          <button type="button" className="saved-close" onClick={onClose}>×</button>
        </div>

        {places.length === 0 ? (
          <div className="saved-empty">
            <Bookmark size={28} />
            <strong>No saved places yet</strong>
            <p>Search for a city and save it to access its weather quickly.</p>
          </div>
        ) : (
          <div className="saved-list">
            {places.map((place) => (
              <div className="saved-place" key={place.city}>
                <button type="button" className="saved-place-main" onClick={() => onSelect(place)}>
                  <div className="saved-place-icon"><MapPin size={19} /></div>
                  <div>
                    <strong>{place.city}</strong>
                    <span>{place.temperature}° • {place.outdoor} outdoor</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="saved-remove"
                  aria-label={`Remove ${place.city}`}
                  onClick={() => onRemove(place.city)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [searchText, setSearchText] = useState("");

  const [weather, setWeather] = useState(
    cityWeather.rishikesh
  );

  const [error, setError] = useState("");

  const [coordinates, setCoordinates] = useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [backendResponse, setBackendResponse] =
    useState(null);

  const [locationName, setLocationName] =
    useState("");

  const [airQuality, setAirQuality] =
    useState(null);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      const stored = localStorage.getItem("weatherwise_saved_places");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showSavedPlaces, setShowSavedPlaces] = useState(false);
  const profileOptions = [
    {
      id: "runner",
      title: "Runner",
      icon: "🏃",
      description: "Best running time, heat, UV, rain and wind.",
    },
    {
      id: "farmer",
      title: "Farmer",
      icon: "🌾",
      description: "Rainfall, temperature, humidity and field conditions.",
    },
    {
      id: "family",
      title: "Family",
      icon: "👨‍👩‍👧",
      description: "School commute, AQI, rain and severe weather awareness.",
    },
    {
      id: "traveler",
      title: "Traveler",
      icon: "✈️",
      description: "Travel suitability, weather risks and packing guidance.",
    },
    {
      id: "event",
      title: "Event Planner",
      icon: "💍",
      description: "Outdoor event suitability and backup planning.",
    },
    {
      id: "commute",
      title: "Office Commute",
      icon: "💼",
      description: "Rain, wind and weather-aware commuting.",
    },
    {
      id: "gardener",
      title: "Gardener",
      icon: "🌱",
      description: "Watering, heat, humidity and plant-care guidance.",
    },
  ];

  const [activeProfile, setActiveProfile] = useState(() => {
    try {
      return localStorage.getItem("weatherwise_profile") || "";
    } catch {
      return "";
    }
  });

  const [showProfile, setShowProfile] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const [alertsLoading, setAlertsLoading] = useState(false);

  const [showAlerts, setShowAlerts] = useState(false);
  const [showEventPlanner, setShowEventPlanner] = useState(false);
  const [showTravelPlanner, setShowTravelPlanner] = useState(false);
  const [travelForm, setTravelForm] = useState({
    destination: "",
    date: "",
    tripType: "Sightseeing",
    days: "2",
  });
  const [travelResult, setTravelResult] = useState(null);

  const [eventForm, setEventForm] = useState({
    name: "",
    type: "Wedding",
    location: "",
    date: "",
    time: "18:00",
    duration: "3",
    setting: "Outdoor",
  });
  const [eventResult, setEventResult] = useState(null);

  const [notificationSettings, setNotificationSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("weatherwise_notifications");
      return stored
        ? JSON.parse(stored)
        : {
            enabled: true,
            severe: true,
            rain: true,
            heat: true,
            air: true,
            profile: true,
          };
    } catch {
      return {
        enabled: true,
        severe: true,
        rain: true,
        heat: true,
        air: true,
        profile: true,
      };
    }
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: "assistant", text: "Hi! I’m WeatherWise. Ask me about today’s weather, outdoor plans, travel, health or your selected profile." }]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        "weatherwise_notifications",
        JSON.stringify(notificationSettings)
      );
    } catch {}
  }, [notificationSettings]);

  const toggleNotificationSetting = (key) => {
    setNotificationSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const smartNotifications = alerts.filter((alert) => {
    if (!notificationSettings.enabled) return false;

    if (alert.severity === "Critical" || alert.severity === "Warning") {
      return notificationSettings.severe;
    }

    if (alert.type === "rain") return notificationSettings.rain;
    if (alert.type === "heat") return notificationSettings.heat;
    if (alert.type === "air") return notificationSettings.air;

    if (notificationSettings.profile && selectedProfile) return true;

    return notificationSettings.severe;
  });


  const getAlertIcon = (type) => {
    if (type === "heat") return "🌡️";
    if (type === "rain") return "🌧️";
    if (type === "wind") return "💨";
    if (type === "storm") return "⛈️";
    if (type === "uv") return "☀️";
    if (type === "air") return "😷";
    return "⚠️";
  };

  const loadAlerts = async () => {
    if (!coordinates) {
      setAlerts([]);
      return;
    }

    setAlertsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/alerts?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
      );

      if (!response.ok) {
        throw new Error("Alerts request failed");
      }

      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (alertError) {
      console.error(alertError);
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  };


  const selectedProfile =
    profileOptions.find((profile) => profile.id === activeProfile) || null;

  useEffect(() => {
    loadAlerts();
  }, [coordinates]);

  const saveProfile = (profileId) => {
    setActiveProfile(profileId);
    try {
      localStorage.setItem("weatherwise_profile", profileId);
    } catch {}
    setShowProfile(false);
  };

  const profileInsight = (() => {
    if (!selectedProfile) return "";

    const temp = typeof weather.temperature === "number" ? weather.temperature : null;
    const rain = typeof weather.rain === "number" ? weather.rain : null;
    const wind = typeof weather.wind === "number" ? weather.wind : null;
    const uv = typeof weather.uv === "number" ? weather.uv : null;
    const aqi = airQuality?.intelligence?.aqi?.value ?? null;

    if (selectedProfile.id === "runner") {
      if (temp !== null && temp >= 34) return "High heat. Prefer an early-morning or evening run.";
      if (rain !== null && rain >= 60) return "Rain risk is high. Consider an indoor workout or wait for a clearer hour.";
      if (uv !== null && uv >= 8) return "UV is very high. Avoid peak sun hours and use sun protection.";
      return "Conditions look suitable for a run. Check the hourly best-time recommendation.";
    }

    if (selectedProfile.id === "farmer") {
      if (rain !== null && rain >= 60) return "Rain is likely. Review rainfall timing before irrigation or field work.";
      if (temp !== null && temp >= 35) return "High temperatures may stress crops. Plan field work during cooler hours.";
      return "Review rainfall, temperature and humidity trends before farm operations.";
    }

    if (selectedProfile.id === "family") {
      if (aqi !== null && aqi > 100) return "Air quality may affect sensitive family members. Reduce prolonged outdoor exposure.";
      if (rain !== null && rain >= 60) return "Rain may affect school and outdoor plans. Keep a rain-ready commute plan.";
      return "Conditions look generally manageable. Check alerts before school or outdoor plans.";
    }

    if (selectedProfile.id === "traveler") {
      if (rain !== null && rain >= 60) return "High rain probability. Carry rain protection and allow extra travel time.";
      if (wind !== null && wind >= 30) return "Strong winds are possible. Check transport and outdoor activity conditions.";
      return "Current conditions look reasonably travel-friendly. Check the forecast before departure.";
    }

    if (selectedProfile.id === "event") {
      if (rain !== null && rain >= 50) return "Rain risk could affect an outdoor event. Prepare an indoor or covered backup.";
      if (temp !== null && temp >= 34) return "High heat may reduce guest comfort. Consider shade, hydration and cooler hours.";
      return "Current conditions are favorable for outdoor planning, subject to the forecast.";
    }

    if (selectedProfile.id === "commute") {
      if (rain !== null && rain >= 60) return "High rain probability may slow your commute. Leave extra time and carry rain protection.";
      if (wind !== null && wind >= 30) return "Strong winds may affect travel comfort. Check conditions before leaving.";
      return "No major weather issue is indicated from the current conditions.";
    }

    return "";
  })();


  useEffect(() => {
    localStorage.setItem(
      "weatherwise_saved_places",
      JSON.stringify(savedPlaces)
    );
  }, [savedPlaces]);

  const saveCurrentPlace = () => {
    const place = {
      city: weather.city,
      temperature: weather.temperature,
      rain: weather.rain,
      outdoor: weather.outdoor,
      uv: weather.uv,
      wind: weather.wind,
    };

    if (!place.city || place.city === "Detecting location..." || place.temperature === "--") {
      setError("Wait for a location with weather data before saving it.");
      return;
    }

    setSavedPlaces((current) => {
      const exists = current.some(
        (item) => item.city.toLowerCase() === place.city.toLowerCase()
      );

      if (exists) {
        return current;
      }

      return [place, ...current];
    });
  };

  const removeSavedPlace = (city) => {
    setSavedPlaces((current) =>
      current.filter((place) => place.city !== city)
    );
  };

  const selectSavedPlace = (place) => {
    setWeather(place);
    setError("");
    setCoordinates(null);
    setBackendResponse(null);
    setAirQuality(null);
    setSelectedPlan(null);
    setLocationName("");
    setShowSavedPlaces(false);
  };

  const openPlan = (plan) => {
    setSelectedPlan(plan);
    window.setTimeout(() => {
      document.getElementById("planning-insights")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const city = searchText.trim().toLowerCase();

    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    const result = cityWeather[city];

    if (result) {
      setWeather(result);

      setError("");

      setCoordinates(null);

      setBackendResponse(null);

      setAirQuality(null);

      setSelectedPlan(null);

      setLocationName("");
    } else {
      setError(
        "This city is not available in the demo yet. Try Delhi, Mumbai, Bangalore, London or Rishikesh."
      );
    }
  };

  const handleCurrentLocation = () => {
    setError("");
    setBackendResponse(null);
    setAirQuality(null);
    setLocationName("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCoordinates({
          latitude,
          longitude,
        });

        setWeather({
          city: "Detecting location...",
          temperature: "--",
          rain: "--",
          outdoor: "--",
          uv: "--",
          wind: "--",
        });

        try {
          // STEP 1: Weather is required.
          const weatherResponse = await fetch(
            `http://127.0.0.1:8000/api/weather?latitude=${latitude}&longitude=${longitude}`
          );

          if (!weatherResponse.ok) {
            throw new Error(
              `Weather backend request failed (${weatherResponse.status})`
            );
          }

          const weatherData = await weatherResponse.json();
          const current = weatherData?.current;

          if (!current) {
            throw new Error("Weather response did not contain current data.");
          }

          // STEP 2: Location name is required for a useful UI.
          const locationResponse = await fetch(
            `http://127.0.0.1:8000/api/location?latitude=${latitude}&longitude=${longitude}`
          );

          if (!locationResponse.ok) {
            throw new Error(
              `Location backend request failed (${locationResponse.status})`
            );
          }

          const locationData = await locationResponse.json();

          const placeName = [
            locationData?.city,
            locationData?.state,
          ]
            .filter(Boolean)
            .join(", ");

          // STEP 3: AQI is optional.
          // If this endpoint fails, weather and location still load.
          try {
            const airQualityResponse = await fetch(
              `http://127.0.0.1:8000/api/air-quality?latitude=${latitude}&longitude=${longitude}`
            );

            if (!airQualityResponse.ok) {
              throw new Error(
                `Air quality backend request failed (${airQualityResponse.status})`
              );
            }

            const airQualityData = await airQualityResponse.json();
            setAirQuality(airQualityData);
          } catch (airError) {
            console.warn(
              "Air quality could not be loaded. WeatherWise will continue without AQI.",
              airError
            );
            setAirQuality(null);
          }

          // STEP 4: Build the main weather card safely.
          const rainProbability =
            weatherData?.hourly?.precipitation_probability?.[0];

          const outdoor =
            weatherData?.intelligence?.outdoor;

          setWeather({
            city:
              placeName ||
              locationData?.country ||
              "Your Location",

            temperature:
              current.temperature_2m != null
                ? Math.round(current.temperature_2m)
                : "--",

            rain:
              rainProbability != null
                ? Math.round(rainProbability)
                : "--",

            outdoor:
              outdoor?.status || "Moderate",

            uv:
              current.uv_index != null
                ? Math.round(current.uv_index)
                : "--",

            wind:
              current.wind_speed_10m != null
                ? Math.round(current.wind_speed_10m)
                : "--",
          });

          // STEP 5: Store the human-readable location.
          setLocationName(
            placeName ||
              locationData?.country ||
              "Your Location"
          );

          // STEP 6: Store the complete weather response
          // for forecast, hourly planning and other features.
          setBackendResponse(weatherData);

          setError("");
        } catch (backendError) {
          console.error("Current-location weather flow failed:", backendError);

          setError(
            backendError.message?.includes("Weather backend")
              ? "WeatherWise could not retrieve live weather data. Make sure the FastAPI backend is running."
              : backendError.message?.includes("Location backend")
              ? "Weather loaded, but the location name could not be retrieved."
              : "Location detected, but WeatherWise could not load the required weather data."
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (geoError) => {
        setLocationLoading(false);

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError(
              "Location permission was denied. Please allow location access."
            );
            break;

          case geoError.POSITION_UNAVAILABLE:
            setError(
              "Your location could not be determined."
            );
            break;

          case geoError.TIMEOUT:
            setError(
              "Location request timed out. Please try again."
            );
            break;

          default:
            setError(
              "Unable to detect your location."
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getTravelDateLimits = () => {
    const today = new Date();
    const toDateInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const minDate = new Date(today);
    const maxStartDate = new Date(today);
    // Open-Meteo's forecast window is up to 16 days. Keep the whole
    // selected trip inside that window (trip length can be up to 7 days).
    maxStartDate.setDate(
      maxStartDate.getDate() + (16 - Number(travelForm.days || 2))
    );

    return {
      min: toDateInput(minDate),
      max: toDateInput(maxStartDate),
    };
  };

  const analyzeTravel = async (travel) => {
    if (!travel.destination || !travel.date) return;

    const limits = getTravelDateLimits();

    if (travel.date < limits.min || travel.date > limits.max) {
      setTravelResult({
        destination: travel.destination,
        status: "Date unavailable",
        risk_score: null,
        message: `Choose a travel date between ${limits.min} and ${limits.max}. WeatherWise currently uses the live forecast window, so dates farther ahead cannot be analyzed reliably.`,
        packing: [],
        advice: [],
      });
      setShowTravelPlanner(true);
      return;
    }

    try {
      const geoResponse = await fetch(
        `http://127.0.0.1:8000/api/geocode?city=${encodeURIComponent(travel.destination)}`
      );

      if (!geoResponse.ok) {
        let detail = "Destination not found";
        try {
          const errorData = await geoResponse.json();
          detail = errorData.detail || detail;
        } catch {}
        throw new Error(detail);
      }

      const geo = await geoResponse.json();

      const response = await fetch(
        `http://127.0.0.1:8000/api/travel-analysis?latitude=${geo.latitude}&longitude=${geo.longitude}&date=${encodeURIComponent(travel.date)}&days=${encodeURIComponent(travel.days)}&trip_type=${encodeURIComponent(travel.tripType)}`
      );

      if (!response.ok) {
        let detail = "Travel analysis unavailable";
        try {
          const errorData = await response.json();
          detail = errorData.detail || detail;
        } catch {}
        throw new Error(detail);
      }

      const data = await response.json();
      setTravelResult({ ...data, destination: travel.destination });
      setShowTravelPlanner(true);
    } catch (error) {
      console.error("Travel analysis failed:", error);
      setTravelResult({
        destination: travel.destination,
        status: "Unavailable",
        risk_score: null,
        message: error.message || "Unable to analyze this destination right now.",
        packing: [],
        advice: [],
      });
      setShowTravelPlanner(true);
    }
  };

  const handleTravelSubmit = (e) => {
    e.preventDefault();
    analyzeTravel(travelForm);
  };

  const analyzeEvent = async (event) => {
    if (!coordinates || !event.date || !event.time) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/event-analysis?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&date=${encodeURIComponent(event.date)}&time=${encodeURIComponent(event.time)}&duration=${encodeURIComponent(event.duration)}`
      );

      if (!response.ok) throw new Error("Event analysis unavailable");

      const data = await response.json();
      setEventResult(data);
      setShowEventPlanner(true);
    } catch (error) {
      console.error(error);
      setEventResult({
        status: "Unavailable",
        risk_score: null,
        message: "Unable to analyze this event right now. Please check that the WeatherWise backend is running.",
        recommendations: [],
      });
      setShowEventPlanner(true);
    }
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    analyzeEvent(eventForm);
  };


  const answerWeatherQuestion = (question) => {
    const q = question.toLowerCase();
    const current = backendResponse?.current;
    const hourly = backendResponse?.hourly;

    if (!current) {
      return "Use your current location first so I can answer using live WeatherWise data.";
    }

    const temp = current.temperature_2m;
    const rain = hourly?.precipitation_probability?.[0] ?? weather.rain;
    const wind = current.wind_speed_10m;
    const uv = current.uv_index;
    const aqi = airQuality?.intelligence?.aqi?.value;

    if (q.includes("umbrella") || q.includes("rain")) {
      return rain >= 50
        ? `Yes. Rain probability is around ${Math.round(rain)}% for the current forecast period, so carrying rain protection is sensible.`
        : `Rain probability is around ${Math.round(rain)}%, so an umbrella is probably not necessary unless conditions change.`;
    }

    if (q.includes("run") || q.includes("running") || q.includes("outside")) {
      if (temp >= 34) return `It is ${Math.round(temp)}°C with elevated heat. Prefer a cooler morning or evening period for running.`;
      if (rain >= 60) return `Rain probability is around ${Math.round(rain)}%. Consider waiting for a clearer hour.`;
      if (uv >= 8) return `The temperature is ${Math.round(temp)}°C, but UV is very high. Avoid peak sun hours and use sun protection.`;
      return `Current conditions are ${Math.round(temp)}°C with ${Math.round(rain)}% rain probability and ${Math.round(wind)} km/h wind. They look reasonably suitable for outdoor activity.`;
    }

    if (q.includes("aqi") || q.includes("air quality") || q.includes("pollution")) {
      return aqi != null
        ? `The current US AQI is ${Math.round(aqi)}. ${airQuality?.intelligence?.aqi?.message || ""}`
        : "Air-quality data is not available for this location right now.";
    }

    if (q.includes("temperature") || q.includes("hot") || q.includes("cold")) {
      return `The current temperature is ${Math.round(temp)}°C, with wind around ${Math.round(wind)} km/h and UV index ${uv != null ? Math.round(uv) : "--"}.`;
    }

    if (q.includes("travel") || q.includes("trip")) {
      return rain >= 60 || wind >= 30
        ? `Travel conditions need some caution: rain probability is ${Math.round(rain)}% and wind is ${Math.round(wind)} km/h.`
        : `Travel conditions currently look manageable: ${Math.round(temp)}°C, ${Math.round(rain)}% rain probability and ${Math.round(wind)} km/h wind.`;
    }

    return `Right now it is ${Math.round(temp)}°C with ${Math.round(rain)}% rain probability, ${Math.round(wind)} km/h wind and UV ${uv != null ? Math.round(uv) : "--"}. Tell me what you’re planning and I’ll turn that into a practical recommendation.`;
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question) return;

    const answer = answerWeatherQuestion(question);
    setChatMessages((messages) => [
      ...messages,
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ]);
    setChatInput("");
  };

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div className="logo">

          <div className="logo-mark">
            <Sun size={21} />
          </div>

          <span>WeatherWise</span>

        </div>

        <nav className="nav">

          <button
            type="button"
            className={`notification-header-button ${
              smartNotifications.length > 0 ? "notification-header-active" : ""
            }`}
            onClick={() => setShowNotifications(true)}
          >
            <Bell size={17} />
            Notifications
            {smartNotifications.length > 0 && (
              <span className="notification-count">
                {smartNotifications.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`alert-header-button ${
              alerts.length > 0 ? "alert-header-active" : ""
            }`}
            onClick={() => setShowAlerts(true)}
          >
            <ShieldAlert size={17} />
            Alerts
            {alerts.length > 0 && (
              <span className="alert-count">{alerts.length}</span>
            )}
          </button>

          <button
            type="button"
            className="profile-header-button"
            onClick={() => setShowProfile(true)}
          >
            {selectedProfile
              ? `${selectedProfile.icon} ${selectedProfile.title}`
              : "Choose Profile"}
          </button>

          <button
            type="button"
            className="planner-header-button"
            onClick={() => setShowTravelPlanner(true)}
          >
            <Plane size={17} />
            Travel Planner
          </button>

          <button
            type="button"
            className="planner-header-button"
            onClick={() => setShowEventPlanner(true)}
          >
            <CalendarDays size={17} />
            Event Planner
          </button>

          <button type="button" onClick={() => setShowSavedPlaces(true)}>
            <Bookmark size={17} />
            Saved Places
            {savedPlaces.length > 0 && (
              <span className="saved-count">{savedPlaces.length}</span>
            )}
          </button>

          <button className="menu-button">
            <Menu size={20} />
          </button>

        </nav>
      </header>

      {/* HERO */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="hero-badge">
              <Sparkles size={16} />
              Smart weather intelligence
            </div>

            <h1>
              Weather that
              <br />
              <span>understands you.</span>
            </h1>

            <p className="hero-description">
              Know the weather. Know what to do.
              Get personalized insights based on
              your plans, health, travel and
              everyday life.
            </p>

            {/* SEARCH */}

            <form
              className="search-box"
              onSubmit={handleSearch}
            >

              <Search size={21} />

              <input
                type="text"
                placeholder="Search for a city..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
              />

              <button
                type="submit"
                className="search-submit"
              >
                Search
              </button>

            </form>

            {/* CURRENT LOCATION */}

            <button
              className="location-button"
              onClick={handleCurrentLocation}
              disabled={locationLoading}
            >

              {locationLoading ? (
                <>
                  <LoaderCircle
                    className="spin"
                    size={18}
                  />

                  Detecting location...
                </>
              ) : (
                <>
                  <Navigation size={18} />

                  Use my current location
                </>
              )}

            </button>

            {/* ERROR */}

            {error && (
              <p className="search-error">
                {error}
              </p>
            )}

            {/* LOCATION SUCCESS */}

            {coordinates && !error && (
              <p className="location-success">

                <MapPin size={15} />

                {locationName
                  ? `${locationName} • `
                  : "Location detected • "}

                {coordinates.latitude.toFixed(4)},{" "}
                {coordinates.longitude.toFixed(4)}

              </p>
            )}

          </div>
        </section>

        {/* QUICK WEATHER */}

        <section className="weather-section">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                QUICK WEATHER
              </p>

              <h2>
                {weather.city}
              </h2>

            </div>

            <span className="live-badge">

              <span></span>

              Live preview

            </span>

          </div>

          <div className="weather-card">

            <div className="temperature-block">

              <Sun
                size={45}
                strokeWidth={1.7}
              />

              <div>

                <div className="temperature">

                  {weather.temperature}

                  {weather.temperature !== "--" &&
                    "°"}

                </div>

                <p>
                  Current temperature
                </p>

              </div>

            </div>

            <div className="weather-grid">

              <WeatherItem
                icon={
                  <CloudRain size={20} />
                }
                label="Rain chance"
                value={
                  weather.rain === "--"
                    ? "--"
                    : `${weather.rain}%`
                }
              />

              <WeatherItem
                icon={
                  <HeartPulse size={20} />
                }
                label="Outdoor"
                value={
                  weather.outdoor
                }
              />

              <WeatherItem
                icon={
                  <Sun size={20} />
                }
                label="UV index"
                value={
                  weather.uv
                }
              />

              <WeatherItem
                icon={
                  <Wind size={20} />
                }
                label="Wind"
                value={
                  weather.wind === "--"
                    ? "--"
                    : `${weather.wind} km/h`
                }
              />

            </div>

          </div>

          <div className="save-place-row">
            <button
              type="button"
              className="save-place-button"
              onClick={saveCurrentPlace}
              disabled={weather.temperature === "--"}
            >
              <Bookmark size={17} />
              {savedPlaces.some((place) => place.city === weather.city)
                ? "Place saved"
                : "Save this place"}
            </button>
          </div>

          {/* 7-DAY FORECAST */}

          <ForecastCard
            daily={backendResponse?.daily}
          />

          {/* OUTDOOR ACTIVITY PLANNER */}

          <OutdoorPlanner
            hourly={backendResponse?.hourly}
          />

          {/* HEALTH & AIR QUALITY */}

          <HealthAirQuality
            airQuality={airQuality}
            weather={backendResponse?.current}
          />

          {/* BACKEND RESPONSE */}

          {backendResponse && (

            <div className="backend-status">

              <div className="backend-status-icon">
                <Sparkles size={18} />
              </div>

              <div>

                <strong>
                  WeatherWise backend connected
                </strong>

                <p>
                  FastAPI received your
                  coordinates and retrieved
                  live weather data.
                </p>

              </div>

            </div>

          )}

        </section>

        {coordinates && smartNotifications.length > 0 && (
          <section className="notifications-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">SMART NOTIFICATIONS</p>
                <h2>Things worth knowing now.</h2>
              </div>

              <button
                type="button"
                className="view-notifications-button"
                onClick={() => setShowNotifications(true)}
              >
                Manage
              </button>
            </div>

            <div className="smart-notification-list">
              {smartNotifications.slice(0, 3).map((notification) => (
                <div
                  className={`smart-notification-card notification-${notification.severity?.toLowerCase() || "watch"}`}
                  key={notification.id}
                >
                  <div className="smart-notification-icon">
                    {getAlertIcon(notification.type)}
                  </div>

                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <span>{notification.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {coordinates && alerts.length > 0 && (
          <section className="alerts-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">WEATHER ALERTS</p>
                <h2>Conditions worth knowing about.</h2>
              </div>

              <button
                type="button"
                className="view-alerts-button"
                onClick={() => setShowAlerts(true)}
              >
                View all
              </button>
            </div>

            <div className="alerts-preview">
              {alerts.slice(0, 2).map((alert) => (
                <div
                  className={`alert-card alert-${alert.severity?.toLowerCase() || "watch"}`}
                  key={alert.id}
                >
                  <div className="alert-card-icon">
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="alert-card-copy">
                    <div className="alert-card-top">
                      <strong>{alert.title}</strong>
                      <span>{alert.severity}</span>
                    </div>
                    <p>{alert.message}</p>
                    <small>{alert.action}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedProfile && (
          <section className="profile-insight-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">PERSONALIZED FOR YOU</p>
                <h2>{selectedProfile.icon} {selectedProfile.title}</h2>
              </div>

              <button
                type="button"
                className="change-profile-button"
                onClick={() => setShowProfile(true)}
              >
                Change profile
              </button>
            </div>

            <div className="profile-insight-card">
              <div className="profile-insight-icon">
                <Sparkles size={22} />
              </div>
              <div>
                <strong>WeatherWise recommendation</strong>
                <p>{profileInsight}</p>
              </div>
            </div>
          </section>
        )}

        {selectedProfile && (
          <ProfileIntelligence
            profile={selectedProfile}
            backendResponse={backendResponse}
            airQuality={airQuality}
          />
        )}

        {/* PLANNING */}

        <section className="planning-section">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                PLAN YOUR DAY
              </p>

              <h2>
                Weather for what matters.
              </h2>

            </div>

          </div>

          <div className="planning-grid">
            <PlanningCard icon={<HeartPulse size={25} />} title="Outdoors" text="Find the best time for walking, running, cycling and outdoor activities." onClick={() => openPlan("outdoors")} />
            <PlanningCard icon={<HeartPulse size={25} />} title="Health" text="Understand AQI, UV, humidity, pollen and weather-related health risks." onClick={() => openPlan("health")} />
            <PlanningCard icon={<Plane size={25} />} title="Travel" text="Check destination weather and get smarter travel and packing guidance." onClick={() => setShowTravelPlanner(true)} />
            <PlanningCard icon={<CalendarDays size={25} />} title="Events" text="Plan outdoor events using forecasts, rain probability and comfort." onClick={() => setShowEventPlanner(true)} />
          </div>

          <PlanningInsights
            selectedPlan={selectedPlan}
            backendResponse={backendResponse}
            airQuality={airQuality}
            weather={backendResponse?.current}
          />

        </section>

        {/* MORE WAYS */}

        <section className="more-section">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                MORE WAYS TO PLAN
              </p>

              <h2>
                Built for real-world decisions.
              </h2>

            </div>

          </div>

          <div className="profile-grid">

            <button type="button" className="mini-profile mini-profile-button" onClick={() => { saveProfile("farmer"); }}>
              <div className="mini-profile-icon"><Tractor size={22} /></div>
              <div><h3>Farmers</h3><p>Rain, soil moisture, frost and planting guidance.</p></div>
            </button>

            <button type="button" className="mini-profile mini-profile-button" onClick={() => { saveProfile("commute"); }}>
              <div className="mini-profile-icon"><BriefcaseBusiness size={22} /></div>
              <div><h3>Daily Commute</h3><p>Visibility, storms, rain and weather-aware travel.</p></div>
            </button>

            <MiniProfile
              icon={
                <CalendarDays
                  size={22}
                />
              }
              title="Wedding Planner"
              text="Forecast-based planning for outdoor ceremonies."
            />

            <button type="button" className="mini-profile mini-profile-button" onClick={() => { saveProfile("gardener"); }}>
              <div className="mini-profile-icon"><Flower2 size={22} /></div>
              <div><h3>Gardeners</h3><p>Weather insights for watering and plant care.</p></div>
            </button>

            <button type="button" className="mini-profile mini-profile-button" onClick={() => { saveProfile("family"); }}>
              <div className="mini-profile-icon"><Users size={22} /></div>
              <div><h3>Families</h3><p>School commute and severe weather awareness.</p></div>
            </button>

          </div>

        </section>

        {/* FEATURES */}

        <section className="feature-section">

          <Feature
            icon={
              <ShieldAlert size={23} />
            }
            title="Severe Weather Alerts"
            text="Know when dangerous weather is approaching."
          />

          <Feature
            icon={
              <AirIcon size={23} />
            }
            title="Air Quality"
            text="Track AQI and environmental conditions."
          />

          <Feature
            icon={
              <Sparkles size={23} />
            }
            title="Daily Insights"
            text="Turn raw weather data into useful decisions."
          />

          <Feature
            icon={
              <Bell size={23} />
            }
            title="Smart Notifications"
            text="Get alerts that actually matter to you."
          />

        </section>

        {/* PERSONALIZATION */}

        <section className="personal-section">

          <div className="personal-copy">

            <p className="eyebrow">
              PERSONALIZATION
            </p>

            <h2>
              Weather for
              <br />
              <span>your world.</span>
            </h2>

            <p>
              WeatherWise adapts weather
              information around the way
              you live and work.
            </p>

          </div>

          <div className="personal-cards">

            <button type="button" className="personal-card" onClick={() => saveProfile("farmer")}>
              <Tractor size={25} />
              <h3>Farmer</h3>
              <p>Rainfall, soil and crop-friendly weather insights.</p>
            </button>

            <button type="button" className="personal-card" onClick={() => { saveProfile("event"); setShowEventPlanner(true); }}>
              <CalendarDays size={25} />
              <h3>Wedding Planner</h3>
              <p>Outdoor event planning powered by forecasts.</p>
            </button>

            <button type="button" className="personal-card" onClick={() => saveProfile("commute")}>
              <BriefcaseBusiness size={25} />
              <h3>Office Commute</h3>
              <p>Know when weather could affect your journey.</p>
            </button>

            <button type="button" className="personal-card" onClick={() => saveProfile("family")}>
              <Users size={25} />
              <h3>Family</h3>
              <p>Keep everyone prepared for changing conditions.</p>
            </button>

          </div>

        </section>

      </main>

      {showSavedPlaces && (
        <SavedPlaces
          places={savedPlaces}
          onSelect={selectSavedPlace}
          onRemove={removeSavedPlace}
          onClose={() => setShowSavedPlaces(false)}
        />
      )}

      {showNotifications && (
        <div
          className="notifications-overlay"
          onClick={() => setShowNotifications(false)}
        >
          <aside
            className="notifications-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="notifications-panel-header">
              <div>
                <p className="eyebrow">WEATHERWISE</p>
                <h2>Smart Notifications</h2>
                <p>Choose which weather updates WeatherWise should surface for you.</p>
              </div>

              <button
                type="button"
                className="panel-close"
                onClick={() => setShowNotifications(false)}
              >
                ×
              </button>
            </div>

            <div className="notification-master">
              <div>
                <strong>Smart notifications</strong>
                <p>Receive relevant weather insights from your selected categories.</p>
              </div>

              <button
                type="button"
                className={`notification-toggle ${
                  notificationSettings.enabled ? "notification-toggle-on" : ""
                }`}
                onClick={() => toggleNotificationSetting("enabled")}
                aria-label="Toggle smart notifications"
              >
                <span />
              </button>
            </div>

            <div className="notification-settings-list">
              {[
                ["severe", "Severe weather", "Important warnings and critical conditions."],
                ["rain", "Rain alerts", "Rain probability and upcoming rainfall."],
                ["heat", "Heat alerts", "High temperature and heat-risk conditions."],
                ["air", "Air quality", "Poor AQI and pollution-related alerts."],
                ["profile", "Profile recommendations", "Insights relevant to your selected profile."],
              ].map(([key, title, description]) => (
                <button
                  type="button"
                  key={key}
                  className="notification-setting"
                  onClick={() => toggleNotificationSetting(key)}
                  disabled={!notificationSettings.enabled}
                >
                  <div>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </div>

                  <span
                    className={`setting-check ${
                      notificationSettings[key] ? "setting-check-on" : ""
                    }`}
                  >
                    {notificationSettings[key] ? "✓" : ""}
                  </span>
                </button>
              ))}
            </div>

            <div className="notification-note">
              <Bell size={18} />
              <p>
                WeatherWise currently stores these preferences in your browser.
                Later, we can connect them to real push notifications.
              </p>
            </div>
          </aside>
        </div>
      )}

      

      {showTravelPlanner && (
        <div className="travel-planner-overlay" onClick={() => setShowTravelPlanner(false)}>
          <aside className="travel-planner-panel" onClick={(e) => e.stopPropagation()}>
            <div className="travel-planner-panel-head">
              <div>
                <span className="eyebrow">WEATHERWISE TRAVEL</span>
                <h2>Plan your trip</h2>
                <p>Check destination weather before you travel.</p>
              </div>
              <button className="panel-close" onClick={() => setShowTravelPlanner(false)}>×</button>
            </div>

            <form className="travel-form" onSubmit={handleTravelSubmit}>
              <label>
                Destination
                <input
                  value={travelForm.destination}
                  onChange={(e) => setTravelForm({ ...travelForm, destination: e.target.value })}
                  placeholder="e.g. Goa, Manali, Jaipur"
                  required
                />
              </label>

              <div className="travel-form-grid">
                <label>
                  Travel date
                  <input
                    type="date"
                    value={travelForm.date}
                    min={getTravelDateLimits().min}
                    max={getTravelDateLimits().max}
                    onChange={(e) => setTravelForm({ ...travelForm, date: e.target.value })}
                    required
                  />
                  <small className="travel-date-note">
                    Live forecast available for the next 16 days.
                  </small>
                </label>

                <label>
                  Trip length
                  <select
                    value={travelForm.days}
                    onChange={(e) => setTravelForm({ ...travelForm, days: e.target.value })}
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="4">4 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
                  </select>
                </label>
              </div>

              <label>
                Trip type
                <select
                  value={travelForm.tripType}
                  onChange={(e) => setTravelForm({ ...travelForm, tripType: e.target.value })}
                >
                  <option>Sightseeing</option>
                  <option>Adventure</option>
                  <option>Beach</option>
                  <option>Business</option>
                  <option>Family</option>
                  <option>Road Trip</option>
                </select>
              </label>

              <button className="travel-analyze-button" type="submit">
                Analyze trip weather
              </button>
            </form>

            {travelResult && (
              <div className="travel-result">
                <div className="travel-result-top">
                  <div>
                    <span className="eyebrow">DESTINATION ANALYSIS</span>
                    <h3>{travelResult.destination}</h3>
                  </div>
                  <div className={`travel-risk-badge ${String(travelResult.status || "").toLowerCase().replace(/\s+/g, "-")}`}>
                    {travelResult.status}
                  </div>
                </div>

                {travelResult.risk_score !== null && travelResult.risk_score !== undefined && (
                  <div className="travel-risk-score">
                    <strong>{travelResult.risk_score}</strong>
                    <span>/ 100 travel suitability</span>
                  </div>
                )}

                <p className="travel-result-message">{travelResult.message}</p>

                {travelResult.summary && (
                  <div className="travel-summary">
                    <div><strong>{travelResult.summary.avg_temperature ?? "—"}°C</strong><span>Avg. temperature</span></div>
                    <div><strong>{travelResult.summary.max_rain_probability ?? "—"}%</strong><span>Rain chance</span></div>
                    <div><strong>{travelResult.summary.max_wind_speed ?? "—"} km/h</strong><span>Max wind</span></div>
                    <div><strong>{travelResult.summary.max_uv_index ?? "—"}</strong><span>UV index</span></div>
                  </div>
                )}

                {travelResult.daily?.length > 0 && (
                  <div className="travel-days">
                    <h4>Trip outlook</h4>
                    {travelResult.daily.map((day, index) => (
                      <div className="travel-day" key={index}>
                        <div>
                          <strong>{day.date}</strong>
                          <span>{day.weather}</span>
                        </div>
                        <div className="travel-day-weather">
                          <strong>{day.max_temperature}° / {day.min_temperature}°</strong>
                          <span>{day.rain_probability}% rain</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="travel-advice-grid">
                  <div>
                    <h4>🎒 What to pack</h4>
                    {travelResult.packing?.map((item, index) => (
                      <div className="travel-list-item" key={index}><span>✓</span>{item}</div>
                    ))}
                  </div>
                  <div>
                    <h4>Travel advice</h4>
                    {travelResult.advice?.map((item, index) => (
                      <div className="travel-list-item" key={index}><span>✓</span>{item}</div>
                    ))}
                  </div>
                </div>

                {travelResult.best_day && (
                  <div className="best-travel-day">
                    <span className="eyebrow">BEST OPTION</span>
                    <strong>{travelResult.best_day.date}</strong>
                    <p>{travelResult.best_day.reason}</p>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      )}

      {showEventPlanner && (
        <div className="event-planner-overlay" onClick={() => setShowEventPlanner(false)}>
          <aside className="event-planner-panel" onClick={(e) => e.stopPropagation()}>
            <div className="event-planner-panel-head">
              <div>
                <span className="eyebrow">WEATHERWISE PLANNER</span>
                <h2>Plan your event</h2>
                <p>Check weather risk before you finalize the schedule.</p>
              </div>
              <button className="panel-close" onClick={() => setShowEventPlanner(false)}>×</button>
            </div>

            <form className="event-form" onSubmit={handleEventSubmit}>
              <label>
                Event name
                <input
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="e.g. College fest"
                  required
                />
              </label>

              <div className="event-form-grid">
                <label>
                  Event type
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  >
                    <option>Wedding</option>
                    <option>Sports</option>
                    <option>Concert</option>
                    <option>Outdoor Party</option>
                    <option>Meeting</option>
                    <option>College Event</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Venue
                  <select
                    value={eventForm.setting}
                    onChange={(e) => setEventForm({ ...eventForm, setting: e.target.value })}
                  >
                    <option>Outdoor</option>
                    <option>Indoor</option>
                    <option>Mixed</option>
                  </select>
                </label>
              </div>

              <label>
                Location
                <input
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="e.g. New Delhi"
                />
              </label>

              <div className="event-form-grid">
                <label>
                  Date
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Start time
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    required
                  />
                </label>
              </div>

              <label>
                Duration
                <select
                  value={eventForm.duration}
                  onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })}
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours</option>
                </select>
              </label>

              <button className="event-analyze-button" type="submit">
                Analyze event weather
              </button>
            </form>

            {eventResult && (
              <div className="event-result">
                <div className="event-result-top">
                  <div>
                    <span className="eyebrow">FORECAST ANALYSIS</span>
                    <h3>{eventForm.name || "Your event"}</h3>
                  </div>
                  <div className={`event-risk-badge ${String(eventResult.status || "").toLowerCase().replace(/\s+/g, "-")}`}>
                    {eventResult.status}
                  </div>
                </div>

                {eventResult.risk_score !== null && eventResult.risk_score !== undefined && (
                  <div className="event-risk-score">
                    <strong>{eventResult.risk_score}</strong>
                    <span>/ 100 weather suitability</span>
                  </div>
                )}

                <p className="event-result-message">{eventResult.message}</p>

                {eventResult.metrics && (
                  <div className="event-metrics">
                    <div><strong>{eventResult.metrics.temperature ?? "—"}°C</strong><span>Temperature</span></div>
                    <div><strong>{eventResult.metrics.rain_probability ?? "—"}%</strong><span>Rain chance</span></div>
                    <div><strong>{eventResult.metrics.wind_speed ?? "—"} km/h</strong><span>Wind</span></div>
                    <div><strong>{eventResult.metrics.uv_index ?? "—"}</strong><span>UV index</span></div>
                  </div>
                )}

                {eventResult.recommendations?.length > 0 && (
                  <div className="event-recommendations">
                    <h4>What WeatherWise recommends</h4>
                    {eventResult.recommendations.map((item, index) => (
                      <div className="event-recommendation" key={index}>
                        <span>✓</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      )}

{showAlerts && (
        <div
          className="alerts-overlay"
          onClick={() => setShowAlerts(false)}
        >
          <aside
            className="alerts-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="alerts-panel-header">
              <div>
                <p className="eyebrow">WEATHERWISE ALERTS</p>
                <h2>Weather alerts</h2>
                <p>Important conditions detected for your current location.</p>
              </div>

              <button
                type="button"
                className="panel-close"
                onClick={() => setShowAlerts(false)}
              >
                ×
              </button>
            </div>

            {alertsLoading ? (
              <div className="alerts-empty">
                <LoaderCircle className="spin" size={26} />
                <strong>Checking conditions...</strong>
              </div>
            ) : !coordinates ? (
              <div className="alerts-empty">
                <ShieldAlert size={28} />
                <strong>Use your current location</strong>
                <p>WeatherWise needs a location to check live alert conditions.</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="alerts-empty alerts-clear">
                <span>✓</span>
                <strong>No severe alerts right now</strong>
                <p>No major weather risk was detected from the available forecast data.</p>
              </div>
            ) : (
              <div className="alerts-list">
                {alerts.map((alert) => (
                  <div
                    className={`alert-detail-card alert-${alert.severity?.toLowerCase() || "watch"}`}
                    key={alert.id}
                  >
                    <div className="alert-detail-icon">
                      {getAlertIcon(alert.type)}
                    </div>

                    <div>
                      <div className="alert-detail-title">
                        <strong>{alert.title}</strong>
                        <span>{alert.severity}</span>
                      </div>

                      <p>{alert.message}</p>

                      <div className="alert-action">
                        <strong>What to do:</strong> {alert.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}

      {showProfile && (
        <div
          className="profile-overlay"
          onClick={() => setShowProfile(false)}
        >
          <aside
            className="profile-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-panel-header">
              <div>
                <p className="eyebrow">PERSONALIZATION</p>
                <h2>Choose your profile</h2>
                <p>WeatherWise will tailor recommendations to what matters to you.</p>
              </div>

              <button
                type="button"
                className="panel-close"
                onClick={() => setShowProfile(false)}
              >
                ×
              </button>
            </div>

            <div className="profile-options">
              {profileOptions.map((profile) => (
                <button
                  type="button"
                  key={profile.id}
                  className={`profile-option ${
                    activeProfile === profile.id ? "profile-option-active" : ""
                  }`}
                  onClick={() => saveProfile(profile.id)}
                >
                  <span className="profile-option-icon">{profile.icon}</span>

                  <span className="profile-option-copy">
                    <strong>{profile.title}</strong>
                    <span>{profile.description}</span>
                  </span>

                  {activeProfile === profile.id && (
                    <span className="profile-check">✓</span>
                  )}
                </button>
              ))}
            </div>

            {activeProfile && (
              <button
                type="button"
                className="clear-profile-button"
                onClick={() => {
                  setActiveProfile("");
                  try {
                    localStorage.removeItem("weatherwise_profile");
                  } catch {}
                  setShowProfile(false);
                }}
              >
                Remove profile
              </button>
            )}
          </aside>
        </div>
      )}

      {showChat && (
        <div className="chat-overlay" onClick={() => setShowChat(false)}>
          <aside className="chat-panel" onClick={(event) => event.stopPropagation()}>
            <div className="chat-panel-header">
              <div>
                <p className="eyebrow">WEATHERWISE AI</p>
                <h2>Ask WeatherWise</h2>
                <p>Answers are based on the weather data loaded for your location.</p>
              </div>
              <button type="button" className="panel-close" onClick={() => setShowChat(false)}>×</button>
            </div>

            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div className={`chat-message chat-${message.role}`} key={index}>
                  <span>{message.role === "assistant" ? "☀️" : "You"}</span>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleChatSubmit}>
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="e.g. Can I go for a run now?"
              />
              <button type="submit">Ask</button>
            </form>
          </aside>
        </div>
      )}

      {/* OPENSTREETMAP ATTRIBUTION */}

      <footer className="footer">
        Location data © OpenStreetMap contributors
      </footer>

      {/* AI CHAT */}

      <button
        className="chat-button"
        aria-label="Open WeatherWise AI"
        onClick={() => setShowChat(true)}
      >

        <MessageCircle size={23} />

        <span>
          Ask WeatherWise
        </span>

      </button>

    </div>
  );
}

export default App;