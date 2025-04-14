const Header = ({ course }) => {
  return <h2>{course.name}</h2>
}
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}
const Content = ({ course }) => {
  return course.parts.map((part) => <Part key={part.id} part={part} />)
}

const Total = ({ course }) => {
  return (
    <p>
      <b>
        total of {course.parts.reduce((acc, part) => acc + part.exercises, 0)}{' '}
        exercises
      </b>
    </p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course
