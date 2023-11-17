import { useState, useEffect } from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_WEATHER_API_KEY;

const App = () => {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState(null);
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => console.error(error.message));
  }, []);

  const selectCountry = (country) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&units=metric&appid=${api_key}`
      )
      .then((response) => {
        setCountryData(
          <div>
            <h1>{country.name.common}</h1>
            <div>Capital: {country.capital}</div>
            <div>
              Area: {country.area} km<sup>2</sup>
            </div>
            <h3>Languages:</h3>
            <ul>
              {Object.values(country.languages).map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img
              width={250}
              src={country.flags.svg}
              alt={`Flag of ${country.name.common}`}
            />
            <h3>Weather in {country.capital}</h3>
            <div>Temperature: {response.data.main.temp} Celsius</div>
            <img
              width={100}
              src={`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`}
              alt={`${response.data.weather[0].description}`}
            />
            <div>Wind speed: {response.data.wind.speed} m/s</div>
          </div>
        );
      })
      .catch((error) => console.error(error.message));
  };

  const filterCountries = (event) => {
    setFilter(event.target.value);
    const selectedCountries = countries?.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );

    if (event.target.value === "" || selectedCountries === null)
      setCountryData(null);
    else if (selectedCountries?.length > 10)
      setCountryData(<div>Too many matches, specify another filter</div>);
    else if (selectedCountries?.length <= 10 && selectedCountries?.length !== 1)
      setCountryData(
        <div>
          {selectedCountries?.map((country) => (
            <div key={country.name.common}>
              {country.name.common}{" "}
              <button onClick={() => setCountryData(selectCountry(country))}>
                show
              </button>
            </div>
          ))}
        </div>
      );
    else if (selectedCountries?.length === 1) {
      setCountryData(selectCountry(selectedCountries[0]));
    }
  };

  return (
    <div>
      find countries <input value={filter} onChange={filterCountries} />
      {countryData}
    </div>
  );
};

export default App;
