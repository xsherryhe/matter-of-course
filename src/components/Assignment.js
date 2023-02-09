import { useState } from 'react';
import fetcher from '../fetcher';

import NavLink from './NavLink';

export default function Assignment({ assignment }) {
  const { id, title, body } = assignment;
  const [expanded, setExpanded] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [addMessage, setAddMessage] = useState(null);

  function handleSubmissionErrors({ data }) {
    if (data.error) setSubmissionError(data.error);
  }

  async function getSubmission() {
    const response = await fetcher(`assignments/${id}/current_submission`);
    if (response.status < 400) setSubmission(response.data);
    else {
      setSubmission(false);
      handleSubmissionErrors(response);
    }
  }

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
    let error;
    if (data.student.includes('is not unique'))
      error = 'You have already started or completed this assignment.';
    else if (data.error) error = data.error;
    setAddMessage(<span className="error">{error}</span>);
  }

  function completeAdd(data) {
    setSubmission(data);
    setAddMessage('Assignment added!');
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

  let details = 'Loading...';
  if (submissionError) details = <div className="error">{submissionError}</div>;
  else if (submission !== null)
    details = (
      <div>
        <div className="buttons">
          {!submission && (
            <span>
              <button onClick={addEmptySubmission}>
                Add to My Assignments
              </button>
              {addMessage && <span>{addMessage}</span>}
            </span>
          )}
          {submission?.status !== 'complete' && (
            <NavLink
              to={
                submission
                  ? `assignment/${submission.id}`
                  : `assignment/${id}/new`
              }
              state={{ assignment, submissionData: submission }}
            >
              <button>
                {submission?.body ? 'Continue' : 'Start'} Assignment
              </button>
            </NavLink>
          )}
        </div>
        {submission?.status === 'complete' && <div>Completed!</div>}
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
      </h3>
      {expanded && details}
    </div>
  );
}
