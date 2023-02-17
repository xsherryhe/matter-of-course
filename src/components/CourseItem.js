import '../styles/CourseItem.css';
import { capitalize } from '../utilities';

import NavLink from './NavLink';
import CourseInstructors from './CourseInstructors';

export default function CourseItem({ course, includeDescription = false }) {
  return (
    <NavLink className="course-item-link" to={`/course/${course.id}`}>
      <div className="course-item">
        <h2 className="title">{course.title}</h2>
        {includeDescription && (
          <div className="description">{course.description}</div>
        )}
        <div>
          <h3>Status:</h3> {capitalize(course.status)}
        </div>
        <CourseInstructors course={course} />
      </div>
    </NavLink>
  );
}
