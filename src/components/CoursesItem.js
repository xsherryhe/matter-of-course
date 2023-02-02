import { Link } from 'react-router-dom';

import CourseInstructors from './CourseInstructors';

export default function CoursesItem({ course }) {
  return (
    <Link to={`/course/${course.id}`}>
      <div>{course.title}</div>
      <div>{course.description}</div>
      <CourseInstructors instructors={course.instructors} />
    </Link>
  );
}
