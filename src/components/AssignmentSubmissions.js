import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/AssignmentSubmissions.css';
import fetcher from '../fetcher';

import BackLink from './BackLink';
import NavLink from './NavLink';
import DeleteButton from './DeleteButton';
import MessageContext from './contexts/MessageContext';

export default function AssignmentSubmissions() {
  const back = useLocation().state?.back;
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [error, setError] = useState(null);

  const setMessage = useContext(MessageContext).set;

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

  function completeDelete() {
    setMessage('Successfully deleted assignment.');
    navigate(
      back?.route ||
        `/course/${assignment?.lesson?.course_id}/lesson/${assignment?.lesson?.id}`,
      { state: back?.state }
    );
  }

  if (error)
    return (
      <div>
        <div className="error">{error}</div>
        <BackLink back={back} />
      </div>
    );
  if (!(assignment && submissions)) return 'Loading...';

  return (
    <div className="assignment-submissions">
      <BackLink back={back} />
      <h1 className="title">{assignment.title}</h1>
      <DeleteButton
        resource="assignment"
        id={assignment.id}
        completeAction={completeDelete}
        handleErrors={handleErrors}
      />
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
                      back: {
                        location: 'Assignment',
                        route: `/assignment/${assignmentId}/submissions`,
                      },
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
