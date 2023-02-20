import { useEffect, useState } from 'react';
import fetcher from '../fetcher';

import withPagination from './higher-order/withPagination';
import CourseItem from './CourseItem';
import NavLink from './NavLink';

function CoursesBase({ page, setLastPage, pagination }) {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getCourses() {
      const response = await fetcher('courses', { query: `page=${page}` });
      if (response.status < 400) {
        setCourses(response.data.courses);
        setLastPage(response.data.last_page);
      } else handleErrors(response);
    }
    getCourses();
  }, [page, setLastPage]);

  let main = 'Loading...';
  if (error) main = <div className="error">{error}</div>;
  else if (courses) {
    main = (
      <div>
        Uh oh, no courses here! Help us out by{' '}
        <NavLink to="/new-course">creating a course</NavLink>.
      </div>
    );
    if (courses.length)
      main = (
        <div className="course-items">
          {courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              includeDescription={true}
            />
          ))}
          {pagination}
        </div>
      );
  }

  return (
    <div>
      <h1>Open Courses</h1>
      <main>{main}</main>
    </div>
  );
}

const Courses = withPagination(CoursesBase);
export default Courses;
