import { Link } from 'react-router-dom';

import CourseInstructors from './CourseInstructors';

export default function CourseItem({ course }) {
  return (
    <Link to={`/course/${course.id}`}>
      <div>{course.title}</div>
      <div>{course.description}</div>
      <div>{course.status}</div>
      <CourseInstructors instructors={course.instructors} />
    </Link>
  );
}
