import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetcher from '../fetcher';

import NavLink from './NavLink';
import DeleteButton from './DeleteButton';
import withErrorHandling from './higher-order/withErrorHandling';

function AssignmentBase({
  assignment,
  handleDelete,
  authorized,
  back,
  error,
  handleErrors,
}) {
  const { state, pathname } = useLocation();
  const { id, title, body } = assignment;
  const expandedId = state?.expanded;
  const [expanded, setExpanded] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [addMessage, setAddMessage] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  const getSubmission = useCallback(async () => {
    const response = await fetcher(`assignments/${id}/current_submission`);
    if (response.status < 400) setSubmission(response.data);
    else {
      setSubmission(false);
      handleErrors(response);
    }
  }, [id, handleErrors]);

  useEffect(() => {
    if (expandedId === id) {
      setExpanded(true);
      getSubmission();
      navigate(pathname, { replace: true });
    }
  }, [expandedId, id, getSubmission, navigate, pathname]);

  function toggleExpand() {
    setExpanded((expanded) => !expanded);
    if (submission === null) getSubmission();
  }

  function validateAdd() {
    if (submission) {
      setAddMessage(
        <span className="error">
          You have already started or completed this assignment.
        </span>
      );
      return false;
    }
    return true;
  }

  function handleAddErrors({ data }) {
    let errorMessage;
    if (data.student.includes('is not unique'))
      errorMessage = 'You have already started or completed this assignment.';
    else if (data.error) error = data.error;
    setAddMessage(<span className="error">{errorMessage}</span>);
  }

  function completeAdd(data) {
    setSubmission(data);
    setAddMessage('Assignment added!');
  }

  function completeDelete() {
    handleDelete();
    setDeleted(true);
  }

  async function addEmptySubmission() {
    if (!validateAdd()) return;

    const response = await fetcher(`assignments/${id}/submissions`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ assignment_submission: { body: '' } }),
    });
    if (response.status < 400) completeAdd(response.data);
    else handleAddErrors(response);
  }

  if (deleted) return 'Assignment has been deleted.';

  let details = 'Loading...';
  if (error?.message) details = <div className="error">{error.message}</div>;
  else if (submission !== null)
    details = (
      <div>
        <div className="buttons">
          {authorized && (
            <NavLink to={`/assignment/${id}/submissions`} state={{ back }}>
              <button>View Student Submissions</button>
            </NavLink>
          )}
          {!submission && (
            <button onClick={addEmptySubmission}>Add to My Assignments</button>
          )}
          {addMessage && <span>{addMessage}</span>}
          <NavLink
            to={
              submission
                ? `/assignment/${submission.id}`
                : `/assignment/${id}/new`
            }
            state={{ back, assignment }}
          >
            <button>
              {submission?.completion_status !== 'complete' &&
                `${submission?.body ? 'Continue' : 'Start'} Assignment`}
              {submission?.completion_status === 'complete' &&
                'View Completed Submission'}
            </button>
          </NavLink>
        </div>
        <div className="body">{body}</div>
      </div>
    );

  return (
    <div className="assignment">
      <h3>
        Assignment: {title}
        <button onClick={toggleExpand}>
          {expanded ? 'Collapse' : 'Expand'}
        </button>
        {authorized && (
          <DeleteButton
            resource="assignment"
            id={id}
            buttonText="Delete"
            completeAction={completeDelete}
          />
        )}
      </h3>
      {expanded && details}
    </div>
  );
}

const Assignment = withErrorHandling(AssignmentBase, {
  catchError: false,
});
export default Assignment;
