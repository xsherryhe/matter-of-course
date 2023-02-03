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

  // TO DO: Link to host
  function handleErrors(data, status) {
    if (!(status === 401)) return;
    let error = `This course is ${data.status}.`;
    if (data.host)
      error += ` For details, contact the course host, ${data.host.name}.`;
    setError(error);
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
      {course.host && <div>Host: {course.host.name}</div>}
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
