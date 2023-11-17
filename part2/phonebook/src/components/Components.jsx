import personService from "/src/services/persons";

const Person = (props) => {
  return (
    <span>
      {props.name} {props.number}{" "}
      <button
        onClick={() => {
          if (confirm(`Delete ${props.name}?`)) {
            personService
              .remove(props.id)
              .then(() => {
                personService
                  .getAll()
                  .then((response) => props.setPersons(response));
              })
              .catch(() => {
                props.setMessage({
                  content: `Information of ${props.name} has been removed from server`,
                  color: "red",
                });
                setTimeout(() => {
                  props.setMessage(null);
                }, 5000);
              });
          }
        }}
      >
        delete
      </button>
      <br />
    </span>
  );
};

export const FilteredPersons = (props) => {
  return props.persons
    .filter((person) =>
      person.name.toLowerCase().includes(props.filter.toLowerCase())
    )
    .map((person) => (
      <Person
        name={person.name}
        number={person.number}
        id={person.id}
        key={person.id}
        setPersons={props.setPersons}
        setMessage={props.setMessage}
      />
    ));
};

export const SearchFilter = (props) => {
  return (
    <div>
      filter shown with:{" "}
      <input
        value={props.filter}
        onChange={(event) => props.setFilter(event.target.value)}
      />
    </div>
  );
};

export const AddPersonForm = (props) => {
  const showMessage = (message, color) => {
    props.setMessage({ content: message, color: color });
    setTimeout(() => {
      props.setMessage(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const person = props.persons.find(
      (person) => person.name.toLowerCase() === props.newName.toLowerCase()
    );

    if (person) {
      if (person.number === props.newNumber)
        alert(`${props.newName} is already added to phonebook`);
      else {
        if (
          confirm(
            `${props.newName} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          personService
            .put(person.id, {
              name: props.newName,
              number: props.newNumber,
            })
            .then(() =>
              personService.getAll().then((response) => {
                props.setPersons(response);
                showMessage(`Added ${props.newName}`, "green");
              })
            )
            .catch(() =>
              showMessage(
                `Information of ${props.newName} has been removed from server`,
                "red"
              )
            );
        }
      }
    } else {
      const nameObject = {
        name: props.newName,
        number: props.newNumber,
      };

      personService.create(nameObject).then((newPerson) => {
        props.setPersons(props.persons.concat(newPerson));
        props.setNewName("");
        props.setNewNumber("");
        showMessage(`Added ${newPerson.name}`, "green");
      });
    }
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name:{" "}
        <input
          value={props.newName}
          onChange={(event) => props.setNewName(event.target.value)}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={props.newNumber}
          onChange={(event) => props.setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const error = {
    color: message.color,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={error}>{message.content}</div>;
};
