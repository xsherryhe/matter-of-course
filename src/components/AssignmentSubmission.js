import asResource from './higher-order/asResource';
import AssignmentSubmissionForm from './AssignmentSubmissionForm';

function AssignmentSubmissionBase({
  resource: submission,
  setResource: setSubmission,
  error,
  editForm,
  editButton,
  deleteButton,
}) {
  let main;
  if (submission.status === 'incomplete')
    main = (
      <AssignmentSubmissionForm
        heading={false}
        defaultValues={submission}
        id={submission.id}
        action="update"
      />
    );
  else
    main = (
      <main>
        <h2>Your completed assignment:</h2>
        {submission.assignment && editButton}
        <div>{submission.body}</div>
      </main>
    );

  return (
    <div>
      {submission.assignment && (
        <div>
          <h1>{submission.assignment.title}</h1>
          <div>{submission.assignment.body}</div>
        </div>
      )}
      {!submission.assignment && (
        <div>
          This assignment no longer exists, but you can still read or delete
          your submission.
        </div>
      )}
      {editForm || main}
    </div>
  );
}

const AssignmentSubmission = asResource(
  AssignmentSubmissionBase,
  AssignmentSubmissionForm,
  'submission',
  { route: (id) => `assignment_submissions/${id}`, formHeading: false }
);
export default AssignmentSubmission;
