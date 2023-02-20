import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/CourseRosterEntry.css';
import fetcher from '../fetcher';
import NavLink from './NavLink';
import DeleteButton from './DeleteButton';
import withPagination from './higher-order/withPagination';

function CourseRosterEntryBase({
  courseId,
  student: { id: studentId, name, username },
  submissionsPage,
  updateSubmissionsPage,
  submissionsPagination,
}) {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const submissionsOnId = state?.submissionsOn;
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
      { query: `student_id=${studentId}&page=${submissionsPage}` }
    );
    if (response.status < 400) {
      setSubmissions(response.data.submissions);
      updateSubmissionsPage(response.data);
    } else handleErrors(response);
  }, [courseId, studentId, submissionsPage, updateSubmissionsPage]);

  useEffect(() => {
    if (submissionsOn) getSubmissions();
  }, [submissionsOn, getSubmissions]);

  useEffect(() => {
    if (submissionsOnId === studentId) {
      setSubmissionsOn(true);
      navigate(pathname, { replace: true });
    }
  }, [submissionsOnId, studentId, navigate, pathname]);

  function toggleSubmissions() {
    setSubmissionsOn((submissionsOn) => !submissionsOn);
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
      submissionsTD = (
        <div className="with-pagination">
          {submissions.map(({ id, assignment: { title } }) => (
            <div key={id}>
              <NavLink
                to={`/assignment/${id}`}
                state={{
                  back: {
                    location: 'Roster',
                    route: `/course/${courseId}`,
                    state: { tab: 'roster', submissionsOn: studentId },
                  },
                }}
              >
                {title}
              </NavLink>
            </div>
          ))}
          {submissionsPagination}
        </div>
      );
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
              state: { tab: 'roster', submissionsOn: false },
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

const CourseRosterEntry = withPagination(CourseRosterEntryBase, 'submissions');
export default CourseRosterEntry;
