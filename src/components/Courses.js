import { useEffect, useState } from 'react';
import fetcher from '../fetcher';

import withPagination from './higher-order/withPagination';
import CourseItem from './CourseItem';
import NavLink from './NavLink';
import withErrorHandling from './higher-order/withErrorHandling';

function CoursesBase({
  coursePage,
  updateCoursePage,
  coursePagination,
  handleErrors,
}) {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    async function getCourses() {
      const response = await fetcher('courses', {
        query: `page=${coursePage}`,
      });
      if (response.status < 400) {
        setCourses(response.data.courses);
        updateCoursePage(response.data);
      } else handleErrors(response);
    }
    getCourses();
  }, [coursePage, updateCoursePage, handleErrors]);

  let main = 'Loading...';
  if (courses) {
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
          {coursePagination}
        </div>
      );
    else
      main = (
        <div>
          Uh oh, no courses here! Help us out by{' '}
          <NavLink to="/new-course">creating a course</NavLink>.
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

const Courses = withErrorHandling(withPagination(CoursesBase, 'course'));
export default Courses;
