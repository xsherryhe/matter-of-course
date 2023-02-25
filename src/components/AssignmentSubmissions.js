import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/AssignmentSubmissions.css';
import fetcher from '../fetcher';

import BackLink from './BackLink';
import NavLink from './NavLink';
import DeleteButton from './DeleteButton';
import MessageContext from './contexts/MessageContext';
import withPagination from './higher-order/withPagination';

function AssignmentSubmissionsBase({
  submissionsPage,
  updateSubmissionsPage,
  submissionsPagination,
}) {
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
    async function getAssignment() {
      const response = await fetcher(`assignments/${assignmentId}`, {
        query: 'with=lesson',
      });
      if (response.status < 400) setAssignment(response.data);
      else handleErrors(response);
    }
    getAssignment();
  }, [assignmentId]);

  useEffect(() => {
    if (!assignment) return;

    async function getSubmissions() {
      const response = await fetcher(
        `assignments/${assignmentId}/submissions`,
        { query: `page=${submissionsPage}` }
      );
      if (response.status < 400) {
        setSubmissions(response.data.submissions);
        updateSubmissionsPage(response.data);
      } else handleErrors(response);
    }
    getSubmissions();
  }, [assignment, assignmentId, submissionsPage, updateSubmissionsPage]);

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
        <div>
          <table className="submissions">
            <thead>
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Submission</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(
                ({
                  id,
                  completion_date: completionDate,
                  student: { name },
                }) => (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{completionDate}</td>
                    <td>
                      <NavLink
                        to={`/assignment/${id}`}
                        state={{
                          back: {
                            location: 'Assignment',
                            route: `/assignment/${assignmentId}/submissions`,
                            state: { submissionsPage, back },
                          },
                        }}
                      >
                        View Submission
                      </NavLink>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          {submissionsPagination}
        </div>
      )}
    </div>
  );
}

const AssignmentSubmissions = withPagination(
  AssignmentSubmissionsBase,
  'submissions'
);
export default AssignmentSubmissions;
