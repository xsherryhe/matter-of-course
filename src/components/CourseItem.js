import '../styles/CourseItem.css';
import { capitalize } from '../utilities';

import NavLink from './NavLink';
import User from './User';
import List from './List';
import CourseAvatarAndTitle from './CourseAvatarAndTitle';

export default function CourseItem({ course, includeDescription = false }) {
  return (
    <NavLink className="course-item-link" to={`/course/${course.id}`}>
      <div
        className={`course-item ${
          includeDescription ? 'include-description' : ''
        }`}
      >
        <h2 className="course-heading">
          <CourseAvatarAndTitle course={course} />
        </h2>
        {includeDescription && (
          <div className="description">{course.description}</div>
        )}
        <div className="status">
          <h3>{capitalize(course.status)}</h3>
        </div>
        <div className="instructors">
          <h3>Instructors:</h3>{' '}
          <List
            items={course.instructors.map((instructor) => (
              <User user={instructor} />
            ))}
          />
        </div>
      </div>
    </NavLink>
  );
}
