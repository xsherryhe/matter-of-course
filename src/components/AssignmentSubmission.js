import asResource from './higher-order/asResource';
import AssignmentSubmissionForm from './AssignmentSubmissionForm';

function AssignmentSubmissionBase({
  resource: submission,
  setResource: setSubmission,
  editForm,
  editButton,
  deleteButton,
}) {
  let main;
  if (submission.completion_status === 'incomplete')
    main = (
      <AssignmentSubmissionForm
        heading={false}
        defaultValues={submission}
        completeAction={setSubmission}
        id={submission.id}
        action="update"
      />
    );
  else
    main = (
      <main>
        <h2>
          {submission.authorized ? 'Your' : `${submission.student.name}'s`}{' '}
          completed assignment:
        </h2>
        {submission.authorized && submission.assignment && editButton}
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
          this submission.
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
