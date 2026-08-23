const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const WEATHER_CODES = {
  0: { label: 'Clear sky' }, 1: { label: 'Mainly clear' }, 2: { label: 'Partly cloudy' },
  3: { label: 'Overcast' }, 45: { label: 'Fog' }, 48: { label: 'Depositing fog' },
  51: { label: 'Light drizzle' }, 53: { label: 'Drizzle' }, 55: { label: 'Dense drizzle' },
  61: { label: 'Light rain' }, 63: { label: 'Rain' }, 65: { label: 'Heavy rain' },
  71: { label: 'Light snow' }, 73: { label: 'Snow' }, 75: { label: 'Heavy snow' },
  80: { label: 'Rain showers' }, 95: { label: 'Thunderstorm' },
}

export function describeWeatherCode(code) {
  return WEATHER_CODES[code] || { label: 'Unknown' }
}

export async function geocodeCity(city) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Location lookup failed.')
  const data = await res.json()
  if (!data.results || data.results.length === 0) {
    throw new Error(`No location found for "${city}".`)
  }
  const { name, country, latitude, longitude, admin1 } = data.results[0]
  return { name, country, admin1, latitude, longitude }
}

export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: 6,
  })
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`)
  if (!res.ok) throw new Error('Weather data is unavailable right now.')
  return res.json()
}

export async function fetchWeatherForCity(city) {
  const location = await geocodeCity(city)
  const weather = await fetchWeather(location.latitude, location.longitude)
  return { location, weather }
}