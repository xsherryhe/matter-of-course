import '../styles/CourseItem.css';
import { capitalize, list } from '../utilities';

import NavLink from './NavLink';

export default function CourseItem({ course, includeDescription = false }) {
  return (
    <NavLink className="course-item-link" to={`/course/${course.id}`}>
      <div className="course-item">
        <h2 className="title">{course.title}</h2>
        {includeDescription && (
          <div className="description">{course.description}</div>
        )}
        <div>
          <h3>{capitalize(course.status)}</h3>
        </div>
        <div>
          <h3>Instructors:</h3>{' '}
          {list(course.instructors.map(({ name }) => name))}
        </div>
      </div>
    </NavLink>
  );
}
