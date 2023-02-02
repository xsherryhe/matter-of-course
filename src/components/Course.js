import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import CourseInstructors from './CourseInstructors';

export default function Course() {
  const courseData = useLocation()?.state?.courseData;
  const { id } = useParams();
  const [course, setCourse] = useState(courseData);

  useEffect(() => {
    if (courseData) return;

    async function getCourse() {
      const response = await fetcher(`courses/${id}`);
      const data = await response.json();
      setCourse(data);
    }
    getCourse();
  }, [courseData, id]);

  if (!course) return 'Loading...';

  return (
    <div>
      <h1>{course.title}</h1>
      <div>Creator: {course.creator.name}</div>
      <CourseInstructors instructors={course.instructors} />
      <div>{course.description}</div>
    </div>
  );
}
