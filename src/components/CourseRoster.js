import { useEffect, useState } from 'react';
import '../styles/CourseRoster.css';
import fetcher from '../fetcher';

import CourseRosterEntry from './CourseRosterEntry';

export default function CourseRoster({ course: { id }, hide }) {
  const [roster, setRoster] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getRoster() {
      const response = await fetcher(`courses/${id}/enrollments`);
      if (response.status < 400) setRoster(response.data);
      else handleErrors(response);
    }
    getRoster();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!roster) return 'Loading...';

  let tbody = 'No students yet!';
  if (roster.length)
    tbody = roster.map(({ student }) => (
      <CourseRosterEntry key={student.id} courseId={id} student={student} />
    ));

  return (
    <div>
      <h2>Course Roster</h2>
      <button className="link" onClick={hide}>
        Back to Course
      </button>
      <table className="course-roster">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tbody}</tbody>
      </table>
    </div>
  );
}
