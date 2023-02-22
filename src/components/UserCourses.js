import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/UserCourses.css';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import NavLink from './NavLink';
import CourseItem from './CourseItem';
import NavButton from './NavButton';
import withPagination from './higher-order/withPagination';

function UserCoursesBase({
  heading = true,
  hostedPage,
  updateHostedPage,
  hostedPagination,
  instructedPage,
  updateInstructedPage,
  instructedPagination,
  enrolledPage,
  updateEnrolledPage,
  enrolledPagination,
}) {
  const [name, setName] = useState(null);
  const [tab, setTab] = useState(null);
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getCourses() {
      const response = await fetcher(id ? `users/${id}` : 'current_user', {
        query: `with=all_courses&page=${hostedPage},${instructedPage},${enrolledPage}`,
      });
      if (response.status < 400) {
        setName(response.data.name);
        const responseCourses = response.data.all_courses;
        setCourses(responseCourses);
        updateHostedPage(responseCourses.hosted);
        updateInstructedPage(responseCourses.instructed);
        updateEnrolledPage(responseCourses.enrolled);
      } else handleErrors(response.data);
    }
    getCourses();
  }, [
    id,
    hostedPage,
    instructedPage,
    enrolledPage,
    updateHostedPage,
    updateInstructedPage,
    updateEnrolledPage,
  ]);

  function tabTo(tabOption) {
    return function () {
      setTab(tabOption);
    };
  }

  if (error) return <div className="error">{error}</div>;
  if (!courses) return 'Loading...';

  const courseTypes = ['hosted', 'instructed', 'enrolled'].filter(
    (courseType) => courses[courseType].courses.length
  );
  const coursePaginations = {
    hosted: hostedPagination,
    instructed: instructedPagination,
    enrolled: enrolledPagination,
  };

  let main;
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
              key={courseType}
              className="course-type tab"
              onClick={tabTo(courseType)}
              disabled={tab ? courseType === tab : i === 0}
            >
              {capitalize(courseType)} Courses
            </NavButton>
          ))}
        <div className="course-items">
          {courses[tab || courseTypes[0]].courses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
          {coursePaginations[tab || courseTypes[0]]}
        </div>
      </main>
    );
  else
    main = (
      <main>
        No courses here! Get started by{' '}
        <NavLink to="/courses">enrolling in a course</NavLink>.
      </main>
    );

  return (
    <div className="user-courses">
      {heading && <h1>{name}'s Courses</h1>}
      {main}
    </div>
  );
}

const UserCourses = ['hosted', 'instructed', 'enrolled'].reduce(
  (Component, resourceName) => withPagination(Component, resourceName),
  UserCoursesBase
);
export default UserCourses;
