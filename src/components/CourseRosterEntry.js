import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/CourseRosterEntry.css';
import fetcher from '../fetcher';
import NavLink from './NavLink';

export default function CourseRosterEntry({
  courseId,
  student: { id: studentId, name, username },
}) {
  const submissionsOnId = useLocation().state?.submissionsOn;
  const [submissionsOn, setSubmissionsOn] = useState(false);
  const [submissions, setSubmissions] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  const getSubmissions = useCallback(async () => {
    const response = await fetcher(
      `courses/${courseId}/assignment_submissions`,
      { query: `student_id=${studentId}` }
    );
    if (response.status < 400) setSubmissions(response.data);
    else handleErrors(response);
  }, [courseId, studentId]);

  function toggleSubmissions() {
    setSubmissionsOn((submissionsOn) => !submissionsOn);
    if (!submissions) getSubmissions();
  }

  useEffect(() => {
    if (submissionsOnId === studentId) {
      setSubmissionsOn(true);
      getSubmissions();
    }
  }, [submissionsOnId, studentId, getSubmissions]);

  let submissionsTD = 'Loading...';
  if (submissions) {
    if (submissions.length)
      submissionsTD = submissions.map(({ id, assignment: { title } }) => (
        <div key={id}>
          <NavLink
            to={`/assignment/${id}`}
            state={{
              back: {
                location: 'Roster',
                route: `/course/${courseId}`,
                state: { rosterOn: true, submissionsOn: studentId },
              },
            }}
          >
            {title}
          </NavLink>
        </div>
      ));
    else submissionsTD = 'This student has not submitted any assignments.';
  } else if (error) submissionsTD = <div className="error">{error}</div>;

  return (
    <tr className="entry">
      <td>{name}</td>
      <td>{username}</td>
      <td>
        <NavLink
          to="/new-message"
          state={{
            recipientOptions: [
              {
                name: `${name} (${username})`,
                value: username,
              },
            ],
            back: {
              location: 'Roster',
              route: `/course/${courseId}`,
              state: { rosterOn: true, submissionsOn: false },
            },
          }}
        >
          <button>Message</button>
        </NavLink>
      </td>
      <td>
        <button onClick={toggleSubmissions}>
          {submissionsOn ? 'Hide' : 'View'} Assignment Submissions
        </button>
      </td>
      {submissionsOn && <td className="submissions">{submissionsTD}</td>}
    </tr>
  );
}
