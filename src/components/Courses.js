import { useEffect, useState } from 'react';
import fetcher from '../fetcher';

import CourseItem from './CourseItem';

export default function Courses() {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    async function getCourses() {
      const response = await fetcher('courses');
      const data = await response.json();
      setCourses(data);
    }
    getCourses();
  }, []);

  if (!courses) return 'Loading...';
  return (
    <div>
      <h1>All Courses</h1>
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </div>
  );
}
