import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';
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
      setName(response.data.name);
      setCourses(response.data.all_courses);
    }
    getCourses();
  }, [id]);

  if (!courses) return 'Loading...';
  return (
    <div>
      <h1>{name}'s Courses</h1>
      {['hosted', 'instructed', 'enrolled'].map((type) => (
        <div key={type} className={type}>
          <h2>{capitalize(type)} Courses</h2>
          {courses[type].map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
        </div>
      ))}
    </div>
  );
}
