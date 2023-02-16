import { useEffect, useState } from 'react';
import fetcher from '../fetcher';

import CourseItem from './CourseItem';
import NavLink from './NavLink';

export default function Courses() {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    async function getCourses() {
      const response = await fetcher('courses');
      setCourses(response.data);
    }
    getCourses();
  }, []);

  if (!courses) return 'Loading...';

  let main = (
    <div>
      Uh oh, no courses here! Help us out by{' '}
      <NavLink to="/new-course">creating a course</NavLink>.
    </div>
  );
  if (courses.length)
    main = courses.map((course) => (
      <CourseItem key={course.id} course={course} />
    ));

  return (
    <div>
      <h1>Open Courses</h1>
      <main>{main}</main>
    </div>
  );
}
