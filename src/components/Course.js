import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import CourseInstructors from './CourseInstructors';
import CourseStatusNotice from './CourseStatusNotice';

export default function Course() {
  const courseData = useLocation()?.state?.courseData;
  const { id } = useParams();
  const [course, setCourse] = useState(courseData);
  const [error, setError] = useState(null);

  // TO DO: Link to creator
  function handleErrors(data, status) {
    if (!(status === 401)) return;
    setError(
      `This course is ${data.status}. For details, contact the course creator, ${data.creator.name}.`
    );
  }

  useEffect(() => {
    if (courseData) return;

    async function getCourse() {
      const response = await fetcher(`courses/${id}`);
      const data = await response.json();
      if (response.status < 400) setCourse(data);
      else handleErrors(data, response.status);
    }
    getCourse();
  }, [courseData, id]);

  if (error) return <div className="error">{error}</div>;
  if (!course) return 'Loading...';

  return (
    <div>
      {<CourseStatusNotice status={course.status} />}
      <h1>{course.title}</h1>
      <div>Creator: {course.creator.name}</div>
      <CourseInstructors instructors={course.instructors} />
      <div>Status: {capitalize(course.status)}</div>
      <div>{course.description}</div>
      <div>
        <h2>Lessons</h2>
        {course.lessons.length
          ? course.lessons.map(({ title }) => title)
          : 'No lessons yet!'}
      </div>
      {course.authorized && <button>Add a Lesson</button>}
    </div>
  );
}
