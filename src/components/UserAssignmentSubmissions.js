import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';
import NavLink from './NavLink';

export default function UserAssignmentSubmissions() {
  const route = useLocation().pathname;
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

  let incomplete = 'No assignments here!';
  if (submissions.incomplete)
    incomplete = submissions.incomplete.map(({ id, title, body }) => (
      <NavLink
        to={`/assignment/${id}`}
        state={{ back: { location: 'My Assignments', route } }}
        key={id}
      >
        <div className="title">
          {title || 'Submission Draft for Deleted Assignment'}
        </div>
        <div className="preview">
          {body ? `${body.slice(0, 51)}...` : 'Not started yet!'}
        </div>
      </NavLink>
    ));

  let complete = 'No assignments here!';
  if (submissions.complete)
    complete = submissions.complete.map(({ id, title, body }) => (
      <NavLink
        to={`/assignment/${id}`}
        state={{ back: { location: 'My Assignments', route } }}
        key={id}
      >
        <div className="title">
          {title || 'Submission for Deleted Assignment'}
        </div>
        <div className="preview">{body.slice(0, 51)}...</div>
      </NavLink>
    ));

  return (
    <div>
      <h1>My Assignments</h1>
      <h2>To Do</h2>
      {incomplete}
      <h2>Completed</h2>
      {complete}
    </div>
  );
}
