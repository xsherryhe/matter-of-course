import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/CourseRosterEntry.css';
import fetcher from '../fetcher';
import NavLink from './NavLink';
import DeleteButton from './DeleteButton';

export default function CourseRosterEntry({
  courseId,
  student: { id: studentId, name, username },
}) {
  const submissionsOnId = useLocation().state?.submissionsOn;
  const [submissionsOn, setSubmissionsOn] = useState(false);
  const [submissions, setSubmissions] = useState(null);
  const [removed, setRemoved] = useState(false);
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

  useEffect(() => {
    if (submissionsOnId === studentId) {
      setSubmissionsOn(true);
      getSubmissions();
    }
  }, [submissionsOnId, studentId, getSubmissions]);

  function toggleSubmissions() {
    setSubmissionsOn((submissionsOn) => !submissionsOn);
    if (!submissions) getSubmissions();
  }

  function completeRemove() {
    setRemoved(true);
  }

  if (removed)
    return (
      <tr className="entry">
        <td className="removed">Student has been removed from course.</td>
      </tr>
    );

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
  }

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
      <td>
        <DeleteButton
          resource="enrollment"
          id={studentId}
          route={`courses/${courseId}/enrollments/${studentId}`}
          action="remove"
          completeAction={completeRemove}
          handleErrors={handleErrors}
          buttonText="Remove Student"
          confirmText="Are you sure you wish to remove this student?"
        />
      </td>
      {error && <td className="error">{error}</td>}
      {submissionsOn && <td className="submissions">{submissionsTD}</td>}
    </tr>
  );
}
