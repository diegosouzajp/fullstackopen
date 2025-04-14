import { useState, useEffect } from 'react'
import axios from 'axios'
import Form from './components/Form'
import Matches from './components/Matches'
import CountryData from './components/CountryData'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setCountries(response.data))
      .catch((error) => console.error(`${error.message} (${error.name})`))
  }, [])

  useEffect(() => {
    setFilteredCountries(countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLocaleLowerCase())))
  }, [countries, filter])

  return (
    <div>
      <Form filter={filter} handleFilterChange={(event) => setFilter(event.target.value)} />
      <Matches filter={filter} countries={countries} setFilteredCountries={setFilteredCountries} />
      {filteredCountries.length === 1 ? <CountryData country={filteredCountries[0]} /> : null}
    </div>
  )
}

export default App
