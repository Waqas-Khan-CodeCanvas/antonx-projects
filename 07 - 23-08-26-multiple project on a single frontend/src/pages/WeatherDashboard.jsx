import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageChrome from '../components/layout/PageChrome'
import SearchBar from '../features/weather/SearchBar'
import CurrentWeather from '../features/weather/CurrentWeather'
import ForecastList from '../features/weather/ForecastList'
import SearchHistory from '../features/weather/SearchHistory'
import { fetchWeatherForCity } from '../utils/weatherApi'
import { CloudSun } from 'lucide-react'

export default function WeatherDashboard() {
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | error | success
  const [errorMessage, setErrorMessage] = useState('')
  const [history, setHistory] = useLocalStorage('weather:history', [])

  const runSearch = async (city) => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const data = await fetchWeatherForCity(city)
      setResult(data)
      setStatus('success')
      setHistory((prev) => {
        const label = `${data.location.name}, ${data.location.country}`
        return [label, ...prev.filter((h) => h !== label)].slice(0, 6)
      })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong.')
    }
  }

  return (
    <div>
      <PageChrome
        eyebrow="module 04"
        title="Weather Desk"
        description="Search any city for current conditions and a short outlook."
        meta="live · open-meteo"
      />

      <div className="container-page max-w-3xl py-12">
        <SearchBar onSearch={runSearch} loading={status === 'loading'} />

        {history.length > 0 && status !== 'loading' && (
          <SearchHistory items={history} onSelect={runSearch} onClear={() => setHistory([])} />
        )}

        <div className="mt-8">
          {status === 'idle' && (
            <div className="rounded-xl border border-dashed border-line py-16 text-center dark:border-line-dark">
              <CloudSun className="mx-auto text-ink-soft dark:text-paper/30" size={28} />
              <p className="mt-3 text-sm text-ink-soft dark:text-paper/50">Search a city to see current conditions.</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="rounded-xl border border-line bg-surface py-16 text-center dark:border-line-dark dark:bg-ink-2">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-line border-t-indigo dark:border-line-dark" />
              <p className="mt-4 text-sm text-ink-soft dark:text-paper/50">Fetching weather data…</p>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-xl border border-negative/40 bg-negative-100 p-6 text-center dark:bg-negative/10">
              <p className="text-sm font-medium text-negative-700 dark:text-negative">{errorMessage}</p>
              <p className="mt-1 text-xs text-ink-soft dark:text-paper/40">Check the spelling or try a nearby larger city.</p>
            </div>
          )}

          {status === 'success' && result && (
            <div className="space-y-6">
              <CurrentWeather location={result.location} current={result.weather.current} />
              <ForecastList daily={result.weather.daily} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}