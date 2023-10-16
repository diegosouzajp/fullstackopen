import { useState } from "react";

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);

const random = (min, max, selected) => {
  let result = 0;
  min = Math.ceil(min);
  max = Math.floor(max);
  do result = Math.floor(Math.random() * (max - min) + min);
  while (result === selected);
  return result;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
  // Each anecdote can only be voted once each time it is rendered
  const [voted, setVoted] = useState(false);

  const indexMostVoted = points.findIndex(
    (point) => point === Math.max(...points)
  );

  const vote = () => {
    if (!voted) {
      setVoted(true);
      const copy = [...points];
      copy[selected] += 1;
      setPoints(copy);
    }
  };

  const nextAnecdote = () => {
    setSelected(random(0, anecdotes.length, selected));
    setVoted(false);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button handleClick={vote} text="vote" />
      <Button handleClick={nextAnecdote} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[indexMostVoted]}</p>
      <p>has {points[indexMostVoted]} votes</p>
    </div>
  );
};

export default App;
