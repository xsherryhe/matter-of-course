import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import CourseItem from './CourseItem';

export default function UserCourses() {
  const [name, setName] = useState(null);
  const [courses, setCourses] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function getCourses() {
      const response = await fetcher(id ? `users/${id}` : 'current_user', {
        query: 'with=all_courses',
      });
      const data = await response.json();
      setName(data.name);
      setCourses(data.all_courses);
    }
    getCourses();
  }, [id]);

  if (!courses) return 'Loading...';

  return (
    <div>
      <h1>{name}'s Courses</h1>
      <div className="created">
        <h2>Created Courses</h2>
        {courses.created.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
      <div className="instructed">
        <h2>Instructed Courses</h2>
        {courses.instructed.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
