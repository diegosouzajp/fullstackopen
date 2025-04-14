const Matches = ({ filter, countries, setFilteredCountries }) => {
  let filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLocaleLowerCase())
  )

  if (filter === '') return
  if (filteredCountries.length > 10) return <div>Too many matches, specify another filter</div>
  else if (filteredCountries.length > 1) {
    return (
      <div>
        {filteredCountries.map((country) => (
          <li key={filteredCountries.indexOf(country)}>
            {country.name.common} <button onClick={() => setFilteredCountries([country])}>Show</button>
          </li>
        ))}
      </div>
    )
  } else if (filteredCountries.length === 0) return <div>No matches found</div>
}

export default Matches
