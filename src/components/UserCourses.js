import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/UserCourses.css';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import NavLink from './NavLink';
import CourseItem from './CourseItem';
import NavButton from './NavButton';

export default function UserCourses({ heading = true }) {
  const [name, setName] = useState(null);
  const [tab, setTab] = useState(null);
  const [courses, setCourses] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function getCourses() {
      const response = await fetcher(id ? `users/${id}` : 'current_user', {
        query: 'with=all_courses',
      });
      setName(response.data.name);
      setCourses(response.data.all_courses);
    }
    getCourses();
  }, [id]);

  function tabTo(tabOption) {
    return function () {
      setTab(tabOption);
    };
  }

  if (!courses) return 'Loading...';

  const courseTypes = ['hosted', 'instructed', 'enrolled'].filter(
    (courseType) => courses[courseType].length
  );

  let main = (
    <main>
      No courses here! Get started by{' '}
      <NavLink to="/courses">enrolling in a course</NavLink>.
    </main>
  );

  if (courseTypes.length)
    main = (
      <main>
        {courseTypes.length === 1 && (
          <div className="course-type">
            {capitalize(courseTypes[0])} Courses
          </div>
        )}
        {courseTypes.length > 1 &&
          courseTypes.map((courseType, i) => (
            <NavButton
              className="course-type tab"
              onClick={tabTo(courseType)}
              disabled={tab ? courseType === tab : i === 0}
            >
              {capitalize(courseType)} Courses
            </NavButton>
          ))}
        <div className="course-items">
          {courses[tab || courseTypes[0]].map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
        </div>
      </main>
    );

  return (
    <div className="user-courses">
      {heading && <h1>{name}'s Courses</h1>}
      {main}
    </div>
  );
}
