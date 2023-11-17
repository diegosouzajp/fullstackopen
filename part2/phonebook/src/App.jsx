import { useState, useEffect } from "react";
import {
  FilteredPersons,
  SearchFilter,
  AddPersonForm,
  Notification,
} from "./components/Components";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <SearchFilter filter={filter} setFilter={setFilter} />

      <h2>add a new</h2>
      <AddPersonForm
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        setMessage={setMessage}
      />

      <h2>Numbers</h2>
      <FilteredPersons
        persons={persons}
        filter={filter}
        setPersons={setPersons}
        setMessage={setMessage}
      />
    </div>
  );
};

export default App;
