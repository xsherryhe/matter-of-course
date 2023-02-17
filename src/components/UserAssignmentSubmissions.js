import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';
import NavButton from './NavButton';
import NavLink from './NavLink';

export default function UserAssignmentSubmissions() {
  const stateTab = useLocation().state?.tab;
  const [submissions, setSubmissions] = useState(null);
  const [tab, setTab] = useState(stateTab || 'incomplete');

  const tabNames = useRef({ incomplete: 'To Do', complete: 'Complete' });

  useEffect(() => {
    async function getSubmissions() {
      const response = await fetcher('current_user', {
        query: 'with=all_assignment_submissions',
      });
      setSubmissions(response.data.all_assignment_submissions);
    }
    getSubmissions();
  }, []);

  function tabTo(tabOption) {
    return function () {
      setTab(tabOption);
    };
  }

  if (!submissions) return 'Loading...';

  let main = <div>No assignments here!</div>;
  if (tab === 'incomplete' && submissions.incomplete)
    main = submissions.incomplete.map(({ id, title, body }) => (
      <NavLink
        to={`/assignment/${id}`}
        state={{
          back: { location: 'My Assignments', route: '/my-assignments' },
        }}
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

  if (tab === 'complete' && submissions.complete)
    main = submissions.complete.map(({ id, title, body }) => (
      <NavLink
        to={`/assignment/${id}`}
        state={{
          back: {
            location: 'My Assignments',
            route: '/my-assignments',
            state: { tab: 'complete' },
          },
        }}
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
      {['incomplete', 'complete'].map((tabOption) => (
        <NavButton
          className="tab"
          disabled={tabOption === tab}
          onClick={tabTo(tabOption)}
          key={tabOption}
        >
          {tabNames.current[tabOption]}
        </NavButton>
      ))}
      {main}
    </div>
  );
}
