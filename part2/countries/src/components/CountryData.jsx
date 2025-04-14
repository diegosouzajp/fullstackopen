import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryData = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    setWeatherData(null)
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${country?.capitalInfo?.latlng?.[0] ?? country?.latlng?.[0]}&lon=${
          country?.capitalInfo?.latlng?.[1] ?? country?.latlng?.[1]
        }&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
      )
      .then((response) => setWeatherData(response.data))
      .catch((error) => console.error(error.message))
  }, [country?.capitalInfo?.latlng, country?.latlng])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital[0]}</div>
      <div>
        Area {country.area} km<sup>2</sup>
      </div>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.svg} width="250" />
      <h2>Weather in {country.capital[0]}</h2>
      {!weatherData ? <div>Please wait</div> : <div>Temperature {weatherData.main.temp} ºC</div>}
      {!weatherData ? null : <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} width="120" />}
      {!weatherData ? null : <div>Wind {weatherData.wind.speed} m/s</div>}
    </div>
  )
}

export default CountryData
