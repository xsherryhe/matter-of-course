import { useState, useRef } from 'react';
import NavButton from './NavButton';
import NavLink from './NavLink';

export default function UserAssignmentSubmissions({
  heading = true,
  submissions,
  submissionsError,
  incompleteSubmissionsPagination,
  completeSubmissionsPagination,
  back,
  tab: initialTab,
}) {
  const [tab, setTab] = useState(initialTab || 'incomplete');

  const tabNames = useRef({ incomplete: 'To Do', complete: 'Complete' });

  function tabTo(tabOption) {
    return function () {
      setTab(tabOption);
    };
  }

  if (submissionsError) return <div className="error">{submissionsError}</div>;
  if (!submissions) return 'Loading...';

  let main = <div>No assignments here!</div>;
  if (tab === 'incomplete' && submissions.incomplete.submissions.length)
    main = (
      <main>
        {submissions.incomplete.submissions.map(({ id, title, body }) => (
          <NavLink to={`/assignment/${id}`} state={{ back }} key={id}>
            <div className="title">
              {title || 'Submission Draft for Deleted Assignment'}
            </div>
            <div className="preview">
              {body ? `${body.slice(0, 51)}...` : 'Not started yet!'}
            </div>
          </NavLink>
        ))}
        {incompleteSubmissionsPagination}
      </main>
    );

  if (tab === 'complete' && submissions.complete.submissions.length)
    main = (
      <main>
        {submissions.complete.submissions.map(({ id, title, body }) => (
          <NavLink
            to={`/assignment/${id}`}
            state={{
              back: {
                ...back,
                state: {
                  tab: 'complete',
                  assignmentTab: 'complete',
                  ...back.state,
                },
              },
            }}
            key={id}
          >
            <div className="title">
              {title || 'Submission for Deleted Assignment'}
            </div>
            <div className="preview">{body.slice(0, 51)}...</div>
          </NavLink>
        ))}
        {completeSubmissionsPagination}
      </main>
    );

  return (
    <div>
      {heading && <h1>My Assignments</h1>}
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
