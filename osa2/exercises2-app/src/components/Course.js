import Content from './Content';
import Sum from './Sum';

//const Part = ({ part }) => <p>{part.name} {part.exercises}</p>;

const Header = ({ course }) => <h1>{course}</h1>

const Course = ({ course }) => {
  return (
    //Construct the component from header, content and sum
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Sum parts={course.parts} />
    </div>
  )
}

export default Course;
