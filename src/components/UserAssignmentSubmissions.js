import { useEffect, useState } from 'react';
import fetcher from '../fetcher';
import NavLink from './NavLink';

export default function UserAssignmentSubmissions() {
  const [submissions, setSubmissions] = useState(null);
  useEffect(() => {
    async function getSubmissions() {
      const response = await fetcher('current_user', {
        query: 'with=all_assignment_submissions',
      });
      setSubmissions(response.data.all_assignment_submissions);
    }
    getSubmissions();
  }, []);

  if (!submissions) return 'Loading...';
  return (
    <div>
      <h1>My Assignments</h1>
      <h2>To Do</h2>
      {submissions.incomplete?.map(({ id, title, body }) => (
        <NavLink to={`/assignment/${id}`} key={id}>
          <div className="title">
            {title || 'Submission Draft for Deleted Assignment'}
          </div>
          <div className="preview">
            {body ? `${body.slice(0, 51)}...` : 'Not started yet!'}
          </div>
        </NavLink>
      ))}
      <h2>Completed</h2>
      {submissions.complete?.map(({ id, title, body }) => (
        <NavLink to={`/assignment/${id}`} key={id}>
          <div className="title">
            {title || 'Submission for Deleted Assignment'}
          </div>
          <div className="preview">{body.slice(0, 51)}...</div>
        </NavLink>
      ))}
    </div>
  );
}
