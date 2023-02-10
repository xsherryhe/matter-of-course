import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../styles/AssignmentSubmissions.css';
import fetcher from '../fetcher';

import NavLink from './NavLink';

export default function AssignmentSubmissions() {
  const { pathname: path, state } = useLocation();
  const back = state?.back;
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getAssignmentAndSubmissions() {
      let assignmentResponse, submissionsResponse;
      assignmentResponse = await fetcher(`assignments/${assignmentId}`, {
        query: 'with=lesson',
      });
      if (assignmentResponse.status < 400)
        submissionsResponse = await fetcher(
          `assignments/${assignmentId}/submissions`
        );
      else return handleErrors(assignmentResponse);

      if (submissionsResponse.status < 400) {
        setAssignment(assignmentResponse.data);
        setSubmissions(submissionsResponse.data);
      } else handleErrors(submissionsResponse);
    }

    getAssignmentAndSubmissions();
  }, [assignmentId]);

  if (error)
    return (
      <div>
        <div className="error">{error}</div>
        {back && <NavLink to={back.location}>Back to {back.name}</NavLink>}
      </div>
    );
  if (!(assignment && submissions)) return 'Loading...';

  return (
    <div className="assignment-submissions">
      {back && <NavLink to={back.location}>Back to {back.name}</NavLink>}
      <h1 className="title">{assignment.title}</h1>
      <div className="lesson">Lesson: {assignment.lesson.title}</div>
      <div className="instructions">{assignment.body}</div>
      <h2>Submissions</h2>
      {!submissions.length && 'No submissions yet!'}
      {submissions.length > 0 && (
        <table className="submissions">
          <thead>
            <tr>
              <th>Student</th>
              <th>Submission</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(({ id, student: { name } }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  <NavLink
                    to={`/assignment/${id}`}
                    state={{
                      back: { name: 'Assignment', location: path },
                    }}
                  >
                    View Submission
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
