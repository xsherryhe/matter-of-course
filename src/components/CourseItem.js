import NavLink from './NavLink';
import CourseInstructors from './CourseInstructors';

export default function CourseItem({ course }) {
  return (
    <NavLink to={`/course/${course.id}`}>
      <div>{course.title}</div>
      <div>{course.description}</div>
      <div>{course.status}</div>
      <CourseInstructors course={course} />
    </NavLink>
  );
}
