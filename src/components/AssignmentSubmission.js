import { useLocation } from 'react-router-dom';

import asResource from './higher-order/asResource';
import AssignmentSubmissionForm from './AssignmentSubmissionForm';
import Comments from './Comments';
import BackLink from './BackLink';

function AssignmentSubmissionBase({
  resource: submission,
  setResource: setSubmission,
  editForm,
  editButton,
  deleteButton,
}) {
  const back = useLocation().state?.back;
  let main;
  if (submission.completion_status === 'incomplete')
    main = (
      <AssignmentSubmissionForm
        heading={false}
        defaultValues={submission}
        completeAction={setSubmission}
        id={submission.id}
        action="update"
        deleteButton={deleteButton}
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
        {submission.authorized && deleteButton}
        <div>{submission.body}</div>
        <Comments
          commentable={submission}
          commentableType="assignment_submission"
        />
      </main>
    );

  return (
    <div>
      <BackLink back={back} />
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
  {
    route: (id) => `assignment_submissions/${id}`,
    redirect: () => ({ route: '/my-assignments' }),
    formHeading: false,
  }
);
export default AssignmentSubmission;
