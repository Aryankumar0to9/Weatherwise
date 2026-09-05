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
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

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


function ProfileMetric({ icon, label, value, description }) {
  return (
    <div className="profile-metric">
      <div className="profile-metric-icon">
        {icon}
      </div>

      <div className="profile-metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{description}</small>
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
                    <span>{place.temperature}° â€¢ {place.outdoor} outdoor</span>
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
function ProfileHero({ profile, onChangeProfile }) {
  const profileInfo = {
    family: {
      subtitle: "Safer days for your loved ones",
      description:
        "Get weather insights tailored for your family's health, school commute and outdoor activities.",
    },

    traveler: {
      subtitle: "Travel smart. Stay prepared.",
      description:
        "Get destination weather, travel risks, packing guidance and safer trip recommendations.",
    },

    commute: {
      subtitle: "Plan better. Reach safer.",
      description:
        "Get weather-aware commuting insights, road conditions and the best time to travel.",
    },

    farmer: {
      subtitle: "Healthy crops. Better harvests.",
      description:
        "Get rainfall, humidity, temperature and field-weather guidance for farming decisions.",
    },

    runner: {
      subtitle: "Move better. Feel better.",
      description:
        "Get running, walking and yoga-friendly weather, best activity times and health guidance.",
    },

    event: {
      subtitle: "Plan confidently. Prepare for change.",
      description:
        "Use weather forecasts, rain probability and comfort conditions to plan outdoor events.",
    },

    gardener: {
      subtitle: "Better weather for better plants.",
      description:
        "Get watering, heat, humidity and plant-care guidance based on local weather.",
    },
  };

  const info =
    profileInfo[profile.id] || {
      subtitle: "Weather that understands your needs.",
      description:
        "WeatherWise adapts weather information around what matters to you.",
    };

  return (
    <section
      className={`profile-dashboard profile-${profile.id}`}
      id="profile-dashboard"
    >
      <div className="profile-dashboard-hero">

        <div className="profile-dashboard-content">

          <span className="profile-using">
            YOU ARE USING
          </span>

          <div className="profile-large-icon">
            {profile.icon}
          </div>

          <h2>
            {profile.title}
          </h2>

          <h3>
            {info.subtitle}
          </h3>

          <p>
            {info.description}
          </p>

          <button
            type="button"
            className="profile-change-button"
            onClick={onChangeProfile}
          >
            Change profile
          </button>

        </div>

      </div>
    </section>
  );
}
function ProfileTabs({ profile }) {
  const tabs = {
    family: [
      "Overview",
      "School & Commute",
      "Health & AQI",
      "Outdoor Activities",
      "Safety Alerts",
    ],

    traveler: [
      "Overview",
      "Travel Conditions",
      "Packing Guide",
      "Alerts & Risks",
      "Itinerary Weather",
    ],

    commute: [
      "Overview",
      "Commute Planner",
      "Road Conditions",
      "Best Time",
      "Alerts",
    ],

    farmer: [
      "Overview",
      "Field Conditions",
      "Rainfall & Irrigation",
      "Crop Advisory",
      "Weather Alerts",
    ],

    runner: [
      "Overview",
      "Best Time",
      "Health Risks",
      "Activity Guide",
      "Alerts",
    ],

    event: [
      "Overview",
      "Event Conditions",
      "Rain Risk",
      "Best Time",
      "Backup Plan",
    ],

    gardener: [
      "Overview",
      "Watering",
      "Plant Care",
      "Weather Risks",
      "Alerts",
    ],
  };

  const profileTabs =
    tabs[profile.id] || ["Overview"];

  return (
    <div className="profile-dashboard-tabs">

      {profileTabs.map((tab, index) => (
        <button
          type="button"
          key={tab}
          className={
            index === 0
              ? "profile-tab profile-tab-active"
              : "profile-tab"
          }
        >
          {tab}
        </button>
      ))}

    </div>
  );
}
function ProfileRecommendation({
  icon,
  title,
  text,
  type = "good",
}) {
  return (
    <div
      className={`profile-recommendation profile-recommendation-${type}`}
    >

      <div className="profile-recommendation-icon">
        {icon}
      </div>

      <div>
        <strong>
          {title}
        </strong>

        <p>
          {text}
        </p>
      </div>

    </div>
  );
}
function FamilyDashboard({
  weather,
  airQuality,
  alerts,
}) {
  const temperature =
    weather?.temperature ?? "--";

  const rain =
    weather?.rain ?? "--";

  const wind =
    weather?.wind ?? "--";

  const uv =
    weather?.uv ?? "--";

  const aqi =
    airQuality?.intelligence?.aqi?.value ?? "--";

  return (
    <div className="profile-content">

      {/* FAMILY OVERVIEW */}

      <section className="profile-section">

        <div className="profile-section-heading">
          <div>
            <p className="eyebrow">
              FAMILY WEATHER
            </p>

            <h3>
              Family Weather Overview
            </h3>

            <p>
              A quick look at today's conditions for your family.
            </p>
          </div>
        </div>

        <div className="profile-content-grid">

          <div className="profile-main-card">

            <div className="profile-metrics">

              <ProfileMetric
                icon="🌡️"
                label="Temperature"
                value={`${temperature}°C`}
                description="Current conditions"
              />

              <ProfileMetric
                icon="🌧️ï¸"
                label="Rain Chance"
                value={
                  rain === "--"
                    ? "--"
                    : `${rain}%`
                }
                description="Chance of rain"
              />

              <ProfileMetric
                icon="☀️"
                label="UV Index"
                value={uv}
                description="Sun exposure"
              />

              <ProfileMetric
                icon="💨"
                label="Wind"
                value={
                  wind === "--"
                    ? "--"
                    : `${wind} km/h`
                }
                description="Current wind"
              />

            </div>

          </div>

          <div className="profile-side-card">

            <h3>
              Key Recommendations
            </h3>

            <ProfileRecommendation
              icon="✓"
              title="Check school commute"
              text={
                rain !== "--" && rain >= 50
                  ? "Rain may affect school travel. Keep a rain-ready plan."
                  : "Weather looks manageable for school travel."
              }
            />

            <ProfileRecommendation
              icon="☀️"
              title="Use sun protection"
              text="Check UV conditions before extended outdoor activities."
              type="warning"
            />

            <ProfileRecommendation
              icon="💧"
              title="Stay comfortable"
              text="Keep children hydrated during warm or humid conditions."
              type="info"
            />

          </div>

        </div>

      </section>

      {/* SCHOOL COMMUTE */}

      <section className="profile-section">

        <div className="profile-main-card">

          <div className="profile-card-heading">
            <div>
              <span className="profile-card-icon">
                🚌
              </span>

              <div>
                <h3>
                  School Commute Planner
                </h3>

                <p>
                  Weather conditions around school timing.
                </p>
              </div>
            </div>
          </div>

          <div className="time-weather-grid">

            {[
              ["7 AM", "â˜ï¸", "24°C"],
              ["9 AM", "🌤️", "26°C"],
              ["12 PM", "☀️", "28°C"],
              ["3 PM", "â˜ï¸", "27°C"],
              ["6 PM", "🌧️ï¸", "25°C"],
            ].map(([time, icon, temp]) => (
              <div
                className="time-weather-card"
                key={time}
              >
                <strong>{time}</strong>
                <span>{icon}</span>
                <b>{temp}</b>
                <small>
                  Weather outlook
                </small>
              </div>
            ))}

          </div>

          <ProfileRecommendation
            icon="🚌"
            title={
              rain !== "--" && rain >= 50
                ? "Rain may affect school travel"
                : "Good weather for school commute"
            }
            text={
              rain !== "--" && rain >= 50
                ? "Keep rain protection ready."
                : "No major weather disruption is expected."
            }
          />

        </div>

      </section>

      {/* HEALTH */}

      <section className="profile-section">

        <div className="profile-content-grid">

          <div className="profile-main-card">

            <h3>
              ❤️ Health & Air Quality
            </h3>

            <p>
              Keep your family healthy and comfortable.
            </p>

            <div className="profile-metrics three">

              <ProfileMetric
                icon="🍃"
                label="AQI"
                value={aqi}
                description={
                  airQuality?.intelligence?.aqi?.status ||
                  "Unavailable"
                }
              />

              <ProfileMetric
                icon="🌼"
                label="Pollen"
                value="Low"
                description="Low current risk"
              />

              <ProfileMetric
                icon="🌡️"
                label="Heat Stress"
                value={
                  typeof weather?.temperature === "number" &&
                  weather.temperature >= 35
                    ? "High"
                    : "Low"
                }
                description="Current heat risk"
              />

            </div>

          </div>

          <div className="profile-side-card">

            <h3>
              Safety Alerts
            </h3>

            {alerts.length === 0 ? (
              <ProfileRecommendation
                icon="✓"
                title="No severe weather alerts"
                text="Conditions look safe for your family."
              />
            ) : (
              alerts.slice(0, 3).map((alert) => (
                <ProfileRecommendation
                  key={alert.id}
                  icon="⚠️"
                  title={alert.title}
                  text={alert.message}
                  type="warning"
                />
              ))
            )}

          </div>

        </div>

      </section>

      {/* OUTDOOR */}

      <section className="profile-section">

        <div className="profile-main-card">

          <h3>
            🌳 Outdoor Activities
          </h3>

          <p>
            Is it a good day for outdoor family activities?
          </p>

          <div className="activity-grid">

            <div className="activity-card">
              <span>🌳</span>
              <strong>Parks & Play</strong>
              <b>Good</b>
            </div>

            <div className="activity-card">
              <span>🚲</span>
              <strong>Cycling</strong>
              <b>Good</b>
            </div>

            <div className="activity-card">
              <span>⚽</span>
              <strong>Sports</strong>
              <b>Good</b>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
function ProfileSpecificContent({
  profile,
  weather,
  airQuality,
  alerts,
  backendResponse,
}) {
  if (!profile) {
    return null;
  }

  const temperature =
    typeof weather?.temperature === "number"
      ? weather.temperature
      : null;

  const rain =
    typeof weather?.rain === "number"
      ? weather.rain
      : null;

  const wind =
    typeof weather?.wind === "number"
      ? weather.wind
      : null;

  const uv =
    typeof weather?.uv === "number"
      ? weather.uv
      : null;

  const humidity =
    typeof weather?.humidity === "number"
      ? weather.humidity
      : null;

  const aqi =
    airQuality?.intelligence?.aqi?.value ?? null;

  const forecast =
    backendResponse?.daily || null;

  const profileConfig = {

    /* =====================================================
       FAMILY
       ===================================================== */

    family: {
      title: "Family Weather Overview",
      subtitle: "A quick look at today's conditions for your family.",

      tabs: [
        "Overview",
        "School & Commute",
        "Health & AQI",
        "Outdoor Activities",
        "Safety Alerts",
      ],

      metrics: [
        {
          icon: "🌡️",
          label: "Temperature",
          value:
            temperature !== null
              ? `${temperature}°C`
              : "--",
          description: "Current conditions",
        },
        {
          icon: "🌧️ï¸",
          label: "Rain Chance",
          value:
            rain !== null
              ? `${rain}%`
              : "--",
          description: "Chance of rain",
        },
        {
          icon: "☀️",
          label: "UV Index",
          value:
            uv !== null
              ? uv
              : "--",
          description: "Sun exposure",
        },
        {
          icon: "💨",
          label: "Wind",
          value:
            wind !== null
              ? `${wind} km/h`
              : "--",
          description: "Current wind",
        },
      ],

      recommendations: [
        {
          icon: "🚌",
          title:
            rain !== null && rain >= 50
              ? "Rain may affect school commute"
              : "Good weather for school commute",
          text:
            rain !== null && rain >= 50
              ? "Keep rain protection ready for school travel."
              : "No major weather disruption is expected.",
          type:
            rain !== null && rain >= 50
              ? "warning"
              : "good",
        },
        {
          icon: "☀️",
          title: "Use sun protection",
          text: "Check UV conditions before extended outdoor activities.",
          type: "warning",
        },
        {
          icon: "💧",
          title: "Keep children hydrated",
          text: "Warm or humid conditions can increase dehydration risk.",
          type: "info",
        },
      ],

      sections: [
        "school",
        "health",
        "outdoor",
        "alerts",
      ],
    },

    /* =====================================================
       TRAVELER
       ===================================================== */

    traveler: {
      title: "Travel Overview",
      subtitle:
        "Key weather factors to help you plan a safer and more comfortable trip.",

      tabs: [
        "Overview",
        "Travel Conditions",
        "Packing Guide",
        "Alerts & Risks",
        "Itinerary Weather",
      ],

      metrics: [
        {
          icon: "🌡️",
          label: "Temperature",
          value:
            temperature !== null
              ? `${temperature}°C`
              : "--",
          description: "Comfort for travel",
        },
        {
          icon: "🌧️ï¸",
          label: "Rain Chance",
          value:
            rain !== null
              ? `${rain}%`
              : "--",
          description: "Rain risk",
        },
        {
          icon: "💨",
          label: "Wind",
          value:
            wind !== null
              ? `${wind} km/h`
              : "--",
          description: "Wind conditions",
        },
        {
          icon: "👁️",
          label: "Visibility",
          value: "Good",
          description: "Travel visibility",
        },
      ],

      recommendations: [
        {
          icon: "✓",
          title:
            rain !== null && rain >= 60
              ? "High rain risk"
              : "Good time to travel",
          text:
            rain !== null && rain >= 60
              ? "Carry rain protection and allow extra travel time."
              : "Current conditions look reasonably travel-friendly.",
          type:
            rain !== null && rain >= 60
              ? "warning"
              : "good",
        },
        {
          icon: "☀️",
          title: "Carry suitable clothing",
          text: "Choose clothing according to temperature and UV conditions.",
          type: "warning",
        },
        {
          icon: "💧",
          title: "Stay hydrated",
          text: "Keep water with you during warm-weather travel.",
          type: "info",
        },
      ],

      sections: [
        "destination",
        "packing",
        "forecast",
        "alerts",
      ],
    },

    /* =====================================================
       OFFICE COMMUTE
       ===================================================== */

    commute: {
      title: "Commute Overview",
      subtitle:
        "Weather conditions that may affect your daily journey.",

      tabs: [
        "Overview",
        "Commute Planner",
        "Road Conditions",
        "Best Time",
        "Alerts",
      ],

      metrics: [
        {
          icon: "🌧️ï¸",
          label: "Rain Risk",
          value:
            rain !== null
              ? `${rain}%`
              : "--",
          description: "Chance of rain",
        },
        {
          icon: "💨",
          label: "Wind",
          value:
            wind !== null
              ? `${wind} km/h`
              : "--",
          description: "Travel comfort",
        },
        {
          icon: "👁️",
          label: "Visibility",
          value: "Good",
          description: "Road visibility",
        },
        {
          icon: "🚗",
          label: "Travel Impact",
          value:
            rain !== null && rain >= 60
              ? "High"
              : "Low",
          description: "Weather impact",
        },
      ],

      recommendations: [
        {
          icon: "✓",
          title:
            rain !== null && rain >= 60
              ? "Allow extra commute time"
              : "Good time to commute",
          text:
            rain !== null && rain >= 60
              ? "Rain may slow your journey."
              : "No major weather disruption is indicated.",
          type:
            rain !== null && rain >= 60
              ? "warning"
              : "good",
        },
        {
          icon: "🕐",
          title: "Check your departure time",
          text: "Compare weather conditions across the morning and evening.",
          type: "info",
        },
        {
          icon: "☔",
          title: "Keep rain protection ready",
          text: "Useful when rain probability increases.",
          type: "warning",
        },
      ],

      sections: [
        "commute",
        "bestTime",
        "road",
        "alerts",
      ],
    },

    /* =====================================================
       FARMER
       ===================================================== */

    farmer: {
      title: "Field Weather Overview",
      subtitle:
        "Weather conditions that matter for farming operations.",

      tabs: [
        "Overview",
        "Field Conditions",
        "Rainfall & Irrigation",
        "Crop Advisory",
        "Weather Alerts",
      ],

      metrics: [
        {
          icon: "🌡️",
          label: "Temperature",
          value:
            temperature !== null
              ? `${temperature}°C`
              : "--",
          description: "Crop heat conditions",
        },
        {
          icon: "💧",
          label: "Humidity",
          value:
            humidity !== null
              ? `${humidity}%`
              : "--",
          description: "Field humidity",
        },
        {
          icon: "🌧️ï¸",
          label: "Rain Chance",
          value:
            rain !== null
              ? `${rain}%`
              : "--",
          description: "Rainfall outlook",
        },
        {
          icon: "💨",
          label: "Wind",
          value:
            wind !== null
              ? `${wind} km/h`
              : "--",
          description: "Wind conditions",
        },
      ],

      recommendations: [
        {
          icon: "🌾",
          title:
            rain !== null && rain < 30
              ? "Good conditions for field work"
              : "Review rainfall before field work",
          text:
            rain !== null && rain < 30
              ? "Weather currently supports most field activities."
              : "Check rainfall timing before planning outdoor farm work.",
          type:
            rain !== null && rain < 30
              ? "good"
              : "warning",
        },
        {
          icon: "💧",
          title:
            rain !== null && rain >= 50
              ? "Irrigation may not be required"
              : "Monitor soil moisture",
          text:
            rain !== null && rain >= 50
              ? "Rainfall may provide useful moisture."
              : "Review field moisture before irrigation.",
          type: "info",
        },
        {
          icon: "🌱",
          title: "Monitor crop conditions",
          text: "Use temperature and humidity trends when planning crop care.",
          type: "warning",
        },
      ],

      sections: [
        "field",
        "irrigation",
        "crop",
        "alerts",
      ],
    },

    /* =====================================================
       RUNNER
       ===================================================== */

    runner: {
      title: "Running Overview",
      subtitle:
        "Today's conditions for running, walking and outdoor exercise.",

      tabs: [
        "Overview",
        "Best Time",
        "Health Risks",
        "Activity Guide",
        "Alerts",
      ],

      metrics: [
        {
          icon: "🌡️",
          label: "Temperature",
          value:
            temperature !== null
              ? `${temperature}°C`
              : "--",
          description: "Running comfort",
        },
        {
          icon: "💨",
          label: "Wind",
          value:
            wind !== null
              ? `${wind} km/h`
              : "--",
          description: "Wind conditions",
        },
        {
          icon: "☀️",
          label: "UV Index",
          value:
            uv !== null
              ? uv
              : "--",
          description: "Sun exposure",
        },
        {
          icon: "💧",
          label: "Humidity",
          value:
            humidity !== null
              ? `${humidity}%`
              : "--",
          description: "Comfort level",
        },
      ],

      recommendations: [
        {
          icon: "✓",
          title:
            temperature !== null && temperature >= 34
              ? "Avoid peak heat"
              : "Good conditions for running",
          text:
            temperature !== null && temperature >= 34
              ? "Prefer early morning or evening exercise."
              : "Current weather is reasonably suitable for outdoor activity.",
          type:
            temperature !== null && temperature >= 34
              ? "warning"
              : "good",
        },
        {
          icon: "☀️",
          title: "Use sun protection",
          text: "Protect exposed skin when UV levels are elevated.",
          type: "warning",
        },
        {
          icon: "💧",
          title: "Stay hydrated",
          text: "Drink water before and after outdoor exercise.",
          type: "info",
        },
      ],

      sections: [
        "exercise",
        "bestTime",
        "health",
        "alerts",
      ],
    },

    /* =====================================================
       EVENT PLANNER
       ===================================================== */

    event: {
      title: "Event Conditions",
      subtitle:
        "Weather information for planning comfortable outdoor events.",

      tabs: [
        "Overview",
        "Event Conditions",
        "Rain Risk",
        "Best Time",
        "Backup Plan",
      ],

      metrics: [
        {
          icon: "🌡️",
          label: "Temperature",
          value:
            temperature !== null
              ? `${temperature}°C`
              : "--",
          description: "Guest comfort",
        },
        {
          icon: "🌧️ï¸",
          label: "Rain Risk",
          value:
            rain !== null
              ? `${rain}%`
              : "--",
          description: "Outdoor rain risk",
        },
        {
          icon: "💨",
          label: "Wind",
          value:
            wind !== null
              ? `${wind} km/h`
              : "--",
          description: "Wind comfort",
        },
        {
          icon: "☀️",
          label: "UV",
          value:
            uv !== null
              ? uv
              : "--",
          description: "Sun exposure",
        },
      ],

      recommendations: [
        {
          icon: rain !== null && rain >= 50 ? "⚠️" : "✓",
          title:
            rain !== null && rain >= 50
              ? "Prepare a rain backup"
              : "Favorable outdoor conditions",
          text:
            rain !== null && rain >= 50
              ? "Consider covered seating or an indoor alternative."
              : "Current conditions are suitable for outdoor planning.",
          type:
            rain !== null && rain >= 50
              ? "warning"
              : "good",
        },
        {
          icon: "🌡️",
          title:
            temperature !== null && temperature >= 34
              ? "Plan for heat"
              : "Comfortable temperatures",
          text:
            temperature !== null && temperature >= 34
              ? "Provide shade and hydration for guests."
              : "Temperature conditions look manageable.",
          type: "info",
        },
        {
          icon: "🕐",
          title: "Choose the right time",
          text: "Use hourly conditions to select the most comfortable event window.",
          type: "info",
        },
      ],

      sections: [
        "event",
        "rainRisk",
        "bestTime",
        "backup",
      ],
    },

    /* =====================================================
       GARDENER
       ===================================================== */

    gardener: {
      title: "Garden Weather Overview",
      subtitle:
        "Weather-based guidance for watering and plant care.",

      tabs: [
        "Overview",
        "Watering",
        "Plant Care",
        "Weather Risks",
        "Alerts",
      ],

      metrics: [
        {
          icon: "🌡️",
          label: "Temperature",
          value:
            temperature !== null
              ? `${temperature}°C`
              : "--",
          description: "Plant heat conditions",
        },
        {
          icon: "💧",
          label: "Humidity",
          value:
            humidity !== null
              ? `${humidity}%`
              : "--",
          description: "Garden humidity",
        },
        {
          icon: "🌧️ï¸",
          label: "Rain Chance",
          value:
            rain !== null
              ? `${rain}%`
              : "--",
          description: "Natural rainfall",
        },
        {
          icon: "☀️",
          label: "UV Index",
          value:
            uv !== null
              ? uv
              : "--",
          description: "Sun intensity",
        },
      ],

      recommendations: [
        {
          icon: "💧",
          title:
            rain !== null && rain >= 50
              ? "Reduce watering"
              : "Check watering needs",
          text:
            rain !== null && rain >= 50
              ? "Rain may provide sufficient moisture."
              : "Check soil moisture before watering.",
          type: "info",
        },
        {
          icon: "🌱",
          title: "Monitor plant stress",
          text:
            temperature !== null && temperature >= 35
              ? "High temperatures may increase plant stress."
              : "Current temperature looks manageable for plants.",
          type:
            temperature !== null && temperature >= 35
              ? "warning"
              : "good",
        },
        {
          icon: "☀️",
          title: "Watch sun exposure",
          text: "Protect sensitive plants during periods of strong sunlight.",
          type: "warning",
        },
      ],

      sections: [
        "garden",
        "watering",
        "plants",
        "alerts",
      ],
    },
  };

  const config =
    profileConfig[profile.id];

  if (!config) {
    return null;
  }

  return (
    <div className="profile-content">

      {/* PROFILE OVERVIEW */}

      <section className="profile-section">

        <div className="profile-section-heading">

          <p className="eyebrow">
            {profile.title.toUpperCase()}
          </p>

          <h3>
            {config.title}
          </h3>

          <p>
            {config.subtitle}
          </p>

        </div>

        <div className="profile-content-grid">

          {/* METRICS */}

          <div className="profile-main-card">

            <div className="profile-metrics">

              {config.metrics.map((metric) => (
                <ProfileMetric
                  key={metric.label}
                  icon={metric.icon}
                  label={metric.label}
                  value={metric.value}
                  description={metric.description}
                />
              ))}

            </div>

          </div>

          {/* RECOMMENDATIONS */}

          <div className="profile-side-card">

            <h3>
              Key Recommendations
            </h3>

            {config.recommendations.map(
              (recommendation, index) => (
                <ProfileRecommendation
                  key={`${recommendation.title}-${index}`}
                  icon={recommendation.icon}
                  title={recommendation.title}
                  text={recommendation.text}
                  type={recommendation.type}
                />
              )
            )}

          </div>

        </div>

      </section>

      {/* PROFILE-SPECIFIC SECTIONS */}

      <ProfileExtraSections
        profile={profile}
        sections={config.sections}
        weather={weather}
        airQuality={airQuality}
        alerts={alerts}
        backendResponse={backendResponse}
        forecast={forecast}
      />

    </div>
  );
}
function AlertProfileCard({ alerts = [] }) {
  return (
    <div className="profile-side-card">

      <h3>
        🔔 Safety Alerts
      </h3>

      {alerts.length === 0 ? (
        <ProfileRecommendation
          icon="✓"
          title="No severe weather alerts"
          text="No active weather alert is currently available for this location."
        />
      ) : (
        alerts.slice(0, 3).map((alert) => (
          <ProfileRecommendation
            key={alert.id}
            icon="⚠️"
            title={alert.title}
            text={alert.message}
            type="warning"
          />
        ))
      )}

    </div>
  );
}
function ActivityProfileCard() {
  return (
    <section className="profile-section">

      <div className="profile-main-card">

        <h3>
          🌳 Outdoor Activities
        </h3>

        <p>
          Current conditions for common outdoor activities.
        </p>

        <div className="activity-grid">

          <div className="activity-card">
            <span>🌳</span>
            <strong>Walking</strong>
            <b>Good</b>
          </div>

          <div className="activity-card">
            <span>🏃</span>
            <strong>Running</strong>
            <b>Good</b>
          </div>

          <div className="activity-card">
            <span>🧘</span>
            <strong>Yoga</strong>
            <b>Good</b>
          </div>

        </div>

      </div>

    </section>
  );
}
function ProfileDashboard({
  profile,
  weather,
  airQuality,
  alerts,
  backendResponse,
  onChangeProfile,
}) {
  if (!profile) {
    return null;
  }

  return (
    <>

      <ProfileHero
        profile={profile}
        onChangeProfile={onChangeProfile}
      />

      <ProfileTabs
        profile={profile}
      />

      <ProfileSpecificContent
        profile={profile}
        weather={weather}
        airQuality={airQuality}
        alerts={alerts}
        backendResponse={backendResponse}
      />

    </>
  );
}
function ProfileExtraSections({
  profile,
  sections,
  weather,
  airQuality,
  alerts,
  backendResponse,
  forecast,
}) {
  return (
    <>

      {/* ==================================================
          FAMILY
          ================================================== */}

      {profile.id === "family" && (
        <>
          <section className="profile-section">

            <div className="profile-main-card">

              <div className="profile-card-heading">
                <div>

                  <span className="profile-card-icon">
                    🚌
                  </span>

                  <div>
                    <h3>
                      School Commute Planner
                    </h3>

                    <p>
                      Weather conditions around school timing.
                    </p>
                  </div>

                </div>
              </div>

              <div className="time-weather-grid">

                {[
                  ["7 AM", "â˜ï¸", "Morning"],
                  ["9 AM", "🌤️", "School"],
                  ["12 PM", "☀️", "Midday"],
                  ["3 PM", "â˜ï¸", "Afternoon"],
                  ["6 PM", "🌧️ï¸", "Evening"],
                ].map(
                  ([time, icon, label]) => (
                    <div
                      className="time-weather-card"
                      key={time}
                    >
                      <strong>{time}</strong>
                      <span>{icon}</span>
                      <b>{label}</b>
                      <small>
                        Check forecast
                      </small>
                    </div>
                  )
                )}

              </div>

            </div>

          </section>

          <section className="profile-section">

            <div className="profile-content-grid">

              <div className="profile-main-card">

                <h3>
                  ❤️ Health & Air Quality
                </h3>

                <p>
                  Keep your family healthy and comfortable.
                </p>

                <div className="profile-metrics three">

                  <ProfileMetric
                    icon="🍃"
                    label="AQI"
                    value={
                      airQuality
                        ?.intelligence
                        ?.aqi
                        ?.value ?? "--"
                    }
                    description={
                      airQuality
                        ?.intelligence
                        ?.aqi
                        ?.status ||
                      "Unavailable"
                    }
                  />

                  <ProfileMetric
                    icon="🌼"
                    label="Pollen"
                    value="Low"
                    description="Current risk"
                  />

                  <ProfileMetric
                    icon="🌡️"
                    label="Heat Stress"
                    value={
                      weather?.temperature >= 35
                        ? "High"
                        : "Low"
                    }
                    description="Current heat risk"
                  />

                </div>

              </div>

              <AlertProfileCard
                alerts={alerts}
              />

            </div>

          </section>

          <ActivityProfileCard />

        </>
      )}

      {/* ==================================================
          TRAVELER
          ================================================== */}

      {profile.id === "traveler" && (
        <>
          <section className="profile-section">

            <div className="profile-content-grid">

              <div className="profile-main-card">

                <h3>
                  🌍 Destination Weather
                </h3>

                <p>
                  Weather factors that matter during your trip.
                </p>

                <div className="profile-metrics">

                  <ProfileMetric
                    icon="🌡️"
                    label="Temperature"
                    value={
                      weather?.temperature !== undefined
                        ? `${weather.temperature}°C`
                        : "--"
                    }
                    description="Current"
                  />

                  <ProfileMetric
                    icon="🌧️ï¸"
                    label="Rain"
                    value={
                      weather?.rain !== undefined
                        ? `${weather.rain}%`
                        : "--"
                    }
                    description="Rain probability"
                  />

                  <ProfileMetric
                    icon="☀️"
                    label="UV"
                    value={weather?.uv ?? "--"}
                    description="Sun intensity"
                  />

                  <ProfileMetric
                    icon="💨"
                    label="Wind"
                    value={
                      weather?.wind !== undefined
                        ? `${weather.wind} km/h`
                        : "--"
                    }
                    description="Wind speed"
                  />

                </div>

              </div>

              <div className="profile-side-card">

                <h3>
                  🎒 Packing Suggestions
                </h3>

                {[
                  "Light comfortable clothing",
                  "Sunglasses",
                  "Sunscreen",
                  "Comfortable shoes",
                  "Rain protection",
                ].map((item) => (
                  <div
                    className="packing-item"
                    key={item}
                  >
                    ✓ {item}
                  </div>
                ))}

              </div>

            </div>

          </section>

          <section className="profile-section">

            <div className="profile-main-card">

              <h3>
                ðŸ“… Destination Forecast
              </h3>

              <p>
                Check upcoming conditions before departure.
              </p>

              <div className="forecast-profile-row">

                {forecast?.time
                  ? forecast.time
                      .slice(0, 7)
                      .map((day, index) => (
                        <div
                          className="forecast-profile-item"
                          key={day}
                        >
                          <strong>
                            {new Date(day).toLocaleDateString(
                              "en-IN",
                              { weekday: "short" }
                            )}
                          </strong>

                          <span>
                            {forecast.temperature_2m_max?.[index] ?? "--"}°
                          </span>
                        </div>
                      ))
                  : (
                    <p>
                      Forecast will appear after weather data loads.
                    </p>
                  )}

              </div>

            </div>

          </section>
        </>
      )}

      {/* ==================================================
          COMMUTE
          ================================================== */}

      {profile.id === "commute" && (
        <>
          <section className="profile-section">

            <div className="profile-content-grid">

              <div className="profile-main-card">

                <h3>
                  🚗 Best Time to Leave
                </h3>

                <p>
                  Compare weather conditions across your commute windows.
                </p>

                <div className="time-weather-grid">

                  {[
                    ["7â€“9 AM", "Good"],
                    ["12â€“2 PM", "Good"],
                    ["5â€“7 PM", "Check"],
                  ].map(
                    ([time, status]) => (
                      <div
                        className="time-weather-card"
                        key={time}
                      >
                        <strong>{time}</strong>
                        <span>🕐</span>
                        <b>{status}</b>
                        <small>
                          Weather window
                        </small>
                      </div>
                    )
                  )}

                </div>

              </div>

              <AlertProfileCard
                alerts={alerts}
              />

            </div>

          </section>

          <section className="profile-section">

            <div className="profile-main-card">

              <h3>
                🛣️ Road & Weather Conditions
              </h3>

              <div className="profile-recommendation">

                <div className="profile-recommendation-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Current weather impact
                  </strong>

                  <p>
                    {weather?.rain >= 60
                      ? "Rain may affect road travel. Allow extra time."
                      : "No major weather-related travel disruption is indicated."}
                  </p>
                </div>

              </div>

            </div>

          </section>
        </>
      )}

      {/* ==================================================
          FARMER
          ================================================== */}

      {profile.id === "farmer" && (
        <>
          <section className="profile-section">

            <div className="profile-content-grid">

              <div className="profile-main-card">

                <h3>
                  🌾 Field Conditions
                </h3>

                <p>
                  Current weather conditions for farm operations.
                </p>

                <div className="profile-metrics">

                  <ProfileMetric
                    icon="🌡️"
                    label="Temperature"
                    value={
                      weather?.temperature !== undefined
                        ? `${weather.temperature}°C`
                        : "--"
                    }
                    description="Crop conditions"
                  />

                  <ProfileMetric
                    icon="💧"
                    label="Humidity"
                    value={
                      weather?.humidity !== undefined
                        ? `${weather.humidity}%`
                        : "--"
                    }
                    description="Field humidity"
                  />

                  <ProfileMetric
                    icon="🌧️ï¸"
                    label="Rain"
                    value={
                      weather?.rain !== undefined
                        ? `${weather.rain}%`
                        : "--"
                    }
                    description="Rain chance"
                  />

                  <ProfileMetric
                    icon="💨"
                    label="Wind"
                    value={
                      weather?.wind !== undefined
                        ? `${weather.wind} km/h`
                        : "--"
                    }
                    description="Wind speed"
                  />

                </div>

              </div>

              <div className="profile-side-card">

                <h3>
                  🚜 Farm Recommendations
                </h3>

                <ProfileRecommendation
                  icon="✓"
                  title="Field work"
                  text="Review rainfall and wind before outdoor operations."
                />

                <ProfileRecommendation
                  icon="💧"
                  title="Irrigation"
                  text={
                    weather?.rain >= 50
                      ? "Rain probability is elevated. Review irrigation requirements."
                      : "Check soil moisture before irrigation."
                  }
                  type="info"
                />

                <ProfileRecommendation
                  icon="🌱"
                  title="Crop monitoring"
                  text="Watch temperature and humidity trends."
                  type="warning"
                />

              </div>

            </div>

          </section>

          <section className="profile-section">

            <div className="profile-main-card">

              <h3>
                🌧️ï¸ Rainfall & Irrigation
              </h3>

              <p>
                Use the upcoming forecast to plan irrigation and field work.
              </p>

              <div className="forecast-profile-row">

                {forecast?.time
                  ? forecast.time
                      .slice(0, 7)
                      .map((day, index) => (
                        <div
                          className="forecast-profile-item"
                          key={day}
                        >
                          <strong>
                            {new Date(day).toLocaleDateString(
                              "en-IN",
                              { weekday: "short" }
                            )}
                          </strong>

                          <span>
                            {forecast.precipitation_probability_max?.[index] ?? "--"}%
                          </span>

                          <small>
                            Rain chance
                          </small>
                        </div>
                      ))
                  : (
                    <p>
                      Forecast data will appear here.
                    </p>
                  )}

              </div>

            </div>

          </section>
        </>
      )}

      {/* ==================================================
          RUNNER
          ================================================== */}

      {profile.id === "runner" && (
        <>
          <section className="profile-section">

            <div className="profile-content-grid">

              <div className="profile-main-card">

                <h3>
                  🏃 Best Time to Exercise
                </h3>

                <p>
                  Cooler hours are generally more comfortable for outdoor exercise.
                </p>

                <div className="time-weather-grid">

                  <div className="time-weather-card">
                    <strong>5â€“8 AM</strong>
                    <span>🌅</span>
                    <b>Best</b>
                    <small>Cooler hours</small>
                  </div>

                  <div className="time-weather-card">
                    <strong>5â€“7 PM</strong>
                    <span>ðŸŒ‡</span>
                    <b>Good</b>
                    <small>Evening window</small>
                  </div>

                  <div className="time-weather-card">
                    <strong>12â€“2 PM</strong>
                    <span>☀️</span>
                    <b>Avoid</b>
                    <small>Peak sun</small>
                  </div>

                </div>

              </div>

              <div className="profile-side-card">

                <h3>
                  ❤️ Health & Safety
                </h3>

                <ProfileRecommendation
                  icon="☀️"
                  title="UV protection"
                  text="Use sun protection when UV levels are elevated."
                  type="warning"
                />

                <ProfileRecommendation
                  icon="💧"
                  title="Hydration"
                  text="Drink water before and after outdoor activity."
                  type="info"
                />

                <ProfileRecommendation
                  icon="🌡️"
                  title="Heat"
                  text={
                    weather?.temperature >= 34
                      ? "High heat. Avoid intense exercise during peak hours."
                      : "No major heat concern from the current temperature."
                  }
                  type={
                    weather?.temperature >= 34
                      ? "warning"
                      : "good"
                  }
                />

              </div>

            </div>

          </section>

          <ActivityProfileCard />

        </>
      )}

      {/* ==================================================
          EVENT
          ================================================== */}

      {profile.id === "event" && (
        <>
          <section className="profile-section">

            <div className="profile-content-grid">

              <div className="profile-main-card">

                <h3>
                  🎉 Event Conditions
                </h3>

                <p>
                  Weather factors that affect guest comfort and event safety.
                </p>

                <div className="profile-metrics">

                  <ProfileMetric
                    icon="🌡️"
                    label="Temperature"
                    value={
                      weather?.temperature !== undefined
                        ? `${weather.temperature}°C`
                        : "--"
                    }
                    description="Guest comfort"
                  />

                  <ProfileMetric
                    icon="🌧️ï¸"
                    label="Rain Risk"
                    value={
                      weather?.rain !== undefined
                        ? `${weather.rain}%`
                        : "--"
                    }
                    description="Outdoor risk"
                  />

                  <ProfileMetric
                    icon="💨"
                    label="Wind"
                    value={
                      weather?.wind !== undefined
                        ? `${weather.wind} km/h`
                        : "--"
                    }
                    description="Wind conditions"
                  />

                  <ProfileMetric
                    icon="☀️"
                    label="UV"
                    value={weather?.uv ?? "--"}
                    description="Sun intensity"
                  />

                </div>

              </div>

              <div className="profile-side-card">

                <h3>
                  🏕️ Backup Plan
                </h3>

                <ProfileRecommendation
                  icon="✓"
                  title={
                    weather?.rain >= 50
                      ? "Prepare a covered backup"
                      : "Backup plan not urgently required"
                  }
                  text={
                    weather?.rain >= 50
                      ? "Consider indoor seating or covered arrangements."
                      : "Continue monitoring the forecast before the event."
                  }
                  type={
                    weather?.rain >= 50
                      ? "warning"
                      : "good"
                  }
                />

              </div>

            </div>

          </section>

          <section className="profile-section">

            <div className="profile-main-card">

              <h3>
                🕐 Best Event Time
              </h3>

              <div className="time-weather-grid">

                <div className="time-weather-card">
                  <strong>Morning</strong>
                  <span>🌤️</span>
                  <b>Good</b>
                  <small>Check hourly forecast</small>
                </div>

                <div className="time-weather-card">
                  <strong>Afternoon</strong>
                  <span>☀️</span>
                  <b>Moderate</b>
                  <small>Watch UV and heat</small>
                </div>

                <div className="time-weather-card">
                  <strong>Evening</strong>
                  <span>ðŸŒ‡</span>
                  <b>Good</b>
                  <small>Check rain risk</small>
                </div>

              </div>

            </div>

          </section>
        </>
      )}

      {/* ==================================================
          GARDENER
          ================================================== */}

      {profile.id === "gardener" && (
        <>
          <section className="profile-section">

            <div className="profile-content-grid">

              <div className="profile-main-card">

                <h3>
                  🌱 Garden Conditions
                </h3>

                <p>
                  Weather factors affecting watering and plant health.
                </p>

                <div className="profile-metrics">

                  <ProfileMetric
                    icon="🌡️"
                    label="Temperature"
                    value={
                      weather?.temperature !== undefined
                        ? `${weather.temperature}°C`
                        : "--"
                    }
                    description="Plant heat"
                  />

                  <ProfileMetric
                    icon="💧"
                    label="Humidity"
                    value={
                      weather?.humidity !== undefined
                        ? `${weather.humidity}%`
                        : "--"
                    }
                    description="Garden humidity"
                  />

                  <ProfileMetric
                    icon="🌧️ï¸"
                    label="Rain"
                    value={
                      weather?.rain !== undefined
                        ? `${weather.rain}%`
                        : "--"
                    }
                    description="Natural rainfall"
                  />

                  <ProfileMetric
                    icon="☀️"
                    label="UV"
                    value={weather?.uv ?? "--"}
                    description="Sun intensity"
                  />

                </div>

              </div>

              <div className="profile-side-card">

                <h3>
                  💧 Watering Recommendation
                </h3>

                <ProfileRecommendation
                  icon="💧"
                  title={
                    weather?.rain >= 50
                      ? "Reduce watering"
                      : "Check soil before watering"
                  }
                  text={
                    weather?.rain >= 50
                      ? "Rain may provide sufficient natural moisture."
                      : "Check soil moisture before watering plants."
                  }
                  type="info"
                />

                <ProfileRecommendation
                  icon="🌱"
                  title="Plant care"
                  text={
                    weather?.temperature >= 35
                      ? "High heat may increase plant stress."
                      : "Current temperature is manageable for most plants."
                  }
                  type={
                    weather?.temperature >= 35
                      ? "warning"
                      : "good"
                  }
                />

              </div>

            </div>

          </section>

          <section className="profile-section">

            <div className="profile-main-card">

              <h3>
                🌦️ Weather Risks
              </h3>

              <div className="activity-grid">

                <div className="activity-card">
                  <span>🌧️ï¸</span>
                  <strong>Heavy Rain</strong>
                  <b>
                    {weather?.rain >= 60
                      ? "Watch"
                      : "Low"}
                  </b>
                </div>

                <div className="activity-card">
                  <span>☀️</span>
                  <strong>High Heat</strong>
                  <b>
                    {weather?.temperature >= 35
                      ? "Watch"
                      : "Low"}
                  </b>
                </div>

                <div className="activity-card">
                  <span>💨</span>
                  <strong>Strong Wind</strong>
                  <b>
                    {weather?.wind >= 30
                      ? "Watch"
                      : "Low"}
                  </b>
                </div>

              </div>

            </div>

          </section>
        </>
      )}

    </>
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
  const [chatMessages, setChatMessages] = useState([{ role: "assistant", text: "Hi! Iâ€™m WeatherWise. Ask me about todayâ€™s weather, outdoor plans, travel, health or your selected profile." }]);
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
    if (type === "rain") return "🌧️ï¸";
    if (type === "wind") return "💨";
    if (type === "storm") return "â›ˆï¸";
    if (type === "uv") return "☀️";
    if (type === "air") return "ðŸ˜·";
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
        `${API_BASE}/api/alerts?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
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
    localStorage.setItem(
      "weatherwise_profile",
      profileId
    );
  } catch {}

  setShowProfile(false);

  setTimeout(() => {
    document
      .getElementById("profile-dashboard")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 150);
};




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
    setAlerts([]);
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
        setCoordinates({ latitude, longitude });
        setWeather({ city: "Detecting location...", temperature: "--", rain: "--", outdoor: "--", uv: "--", wind: "--" });

        try {
          const weatherResponse = await fetch(`${API_BASE}/api/weather?latitude=${latitude}&longitude=${longitude}`);
          if (!weatherResponse.ok) throw new Error(`Weather backend request failed (${weatherResponse.status})`);

          const weatherData = await weatherResponse.json();
          const current = weatherData?.current;
          if (!current) throw new Error("Weather response did not contain current data.");

          const rainProbability = weatherData?.hourly?.precipitation_probability?.[0];
          const outdoor = weatherData?.intelligence?.outdoor;
          const weatherCard = {
            city: "Your Location",
            temperature: current.temperature_2m != null ? Math.round(current.temperature_2m) : "--",
            rain: rainProbability != null ? Math.round(rainProbability) : "--",
            outdoor: outdoor?.status || "Moderate",
            uv: current.uv_index != null ? Math.round(current.uv_index) : "--",
            wind: current.wind_speed_10m != null ? Math.round(current.wind_speed_10m) : "--",
          };

          // Weather is the only required request for the homepage.
          setWeather(weatherCard);
          setBackendResponse(weatherData);
          setLocationName("Your Location");
          setError("");

          // City-name lookup is optional and must never hide loaded weather.
          try {
            const locationResponse = await fetch(`${API_BASE}/api/location?latitude=${latitude}&longitude=${longitude}`);
            if (locationResponse.ok) {
              const locationData = await locationResponse.json();
              const placeName = [locationData?.city, locationData?.state].filter(Boolean).join(", ") || locationData?.country;
              if (placeName) {
                setWeather((previous) => ({ ...previous, city: placeName }));
                setLocationName(placeName);
              }
            }
          } catch (locationError) {
            console.warn("City-name lookup failed; weather remains available.", locationError);
          }

          // AQI is optional too.
          try {
            const airQualityResponse = await fetch(`${API_BASE}/api/air-quality?latitude=${latitude}&longitude=${longitude}`);
            if (!airQualityResponse.ok) throw new Error(`Air quality backend request failed (${airQualityResponse.status})`);
            setAirQuality(await airQualityResponse.json());
          } catch (airError) {
            console.warn("Air quality could not be loaded. WeatherWise will continue without AQI.", airError);
            setAirQuality(null);
          }
        } catch (backendError) {
          console.error("Current-location weather flow failed:", backendError);
          setError(
            backendError.message?.includes("Weather backend")
              ? "WeatherWise could not retrieve live weather data. Make sure the FastAPI backend is running."
              : "Location detected, but WeatherWise could not load the required weather data."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (geoError) => {
        setLocationLoading(false);
        if (geoError.code === geoError.PERMISSION_DENIED) setError("Location permission was denied. Please allow location access.");
        else if (geoError.code === geoError.POSITION_UNAVAILABLE) setError("Your location could not be determined.");
        else if (geoError.code === geoError.TIMEOUT) setError("Location request timed out. Please try again.");
        else setError("Unable to detect your location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
    // WeatherWise guarantees a fallback forecast window of up to 9 days.
    // Keep the selected trip inside that window (trip length can be up to 7 days).
    maxStartDate.setDate(
      maxStartDate.getDate() + (9 - Number(travelForm.days || 2))
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
        `${API_BASE}/api/geocode?city=${encodeURIComponent(travel.destination)}`
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
        `${API_BASE}/api/travel-analysis?latitude=${geo.latitude}&longitude=${geo.longitude}&date=${encodeURIComponent(travel.date)}&days=${encodeURIComponent(travel.days)}&trip_type=${encodeURIComponent(travel.tripType)}`
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
    if (!event.date || !event.time) return;

    try {
      let latitude = coordinates?.latitude;
      let longitude = coordinates?.longitude;

      // If the user entered an event location, analyze that location.
      // Otherwise use the current detected location.
      if (event.location.trim()) {
        const geoResponse = await fetch(
          `${API_BASE}/api/geocode?city=${encodeURIComponent(event.location.trim())}`
        );

        if (!geoResponse.ok) {
          let detail = "Event location not found";
          try {
            const errorData = await geoResponse.json();
            detail = errorData.detail || detail;
          } catch {}
          throw new Error(detail);
        }

        const geo = await geoResponse.json();
        latitude = geo.latitude;
        longitude = geo.longitude;
      }

      if (latitude == null || longitude == null) {
        throw new Error("Enter an event location or use your current location first.");
      }

      const response = await fetch(
        `${API_BASE}/api/event-analysis?latitude=${latitude}&longitude=${longitude}&date=${encodeURIComponent(event.date)}&time=${encodeURIComponent(event.time)}&duration=${encodeURIComponent(event.duration)}&setting=${encodeURIComponent(event.setting)}`
      );

      if (!response.ok) {
        let detail = "Event analysis unavailable";
        try {
          const errorData = await response.json();
          detail = errorData.detail || detail;
        } catch {}
        throw new Error(detail);
      }

      const data = await response.json();
      setEventResult({
        ...data,
        location: event.location || "Current location",
      });
      setShowEventPlanner(true);
    } catch (error) {
      console.error("Event analysis failed:", error);
      setEventResult({
        status: "Unavailable",
        risk_score: null,
        message: error.message || "Unable to analyze this event right now.",
        recommendations: [],
      });
      setShowEventPlanner(true);
    }
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    analyzeEvent(eventForm);
  };


  const getEventDateLimits = () => {
    const today = new Date();
    const toDateInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 8);

    return {
      min: toDateInput(today),
      max: toDateInput(maxDate),
    };
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

    return `Right now it is ${Math.round(temp)}°C with ${Math.round(rain)}% rain probability, ${Math.round(wind)} km/h wind and UV ${uv != null ? Math.round(uv) : "--"}. Tell me what youâ€™re planning and Iâ€™ll turn that into a practical recommendation.`;
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
                  ? `${locationName} â€¢ `
                  : "Location detected â€¢ "}

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
  <ProfileDashboard
    profile={selectedProfile}
    weather={weather}
    airQuality={airQuality}
    alerts={alerts}
    backendResponse={backendResponse}
    onChangeProfile={() => setShowProfile(true)}
  />
)}

        {selectedProfile && (
          <ProfileIntelligence
            profile={selectedProfile}
            backendResponse={backendResponse}
            airQuality={airQuality}
          />
        )}




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
                    Live forecast is available for the next 9 days.
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
                    min={getEventDateLimits().min}
                    max={getEventDateLimits().max}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                  />
                  <small className="travel-date-note">
                    Live event forecast available for the next 9 days.
                  </small>
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
                    {eventResult.location && (
                      <p className="event-result-location">{eventResult.location}</p>
                    )}
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
        Location data Â© OpenStreetMap contributors
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