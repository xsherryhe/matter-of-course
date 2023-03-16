import { useLocation } from 'react-router-dom';
import '../styles/AssignmentSubmission.css';

import asResource from './higher-order/asResource';
import AssignmentSubmissionForm from './AssignmentSubmissionForm';
import AppendedComments from './AppendedComments';
import BackLink from './BackLink';
import TextWithUser from './TextWithUser';

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
        back={false}
        defaultValues={submission}
        completeAction={setSubmission}
        action="update"
        deleteButton={deleteButton}
      />
    );
  else
    main = (
      <main>
        <h2>
          <TextWithUser
            user={submission.student}
            text={`${
              submission.owned ? 'Your' : `${submission.student.name}'s`
            } completed
          assignment:`}
          />
        </h2>
        {submission.authorized && submission.assignment && editButton}
        {submission.owned && deleteButton}
        <div className="completion-date">
          <h3>Submitted:</h3> {submission.completion_date}
        </div>
        <div>{submission.body}</div>
        <AppendedComments
          commentable={submission}
          commentableType="assignment_submission"
        />
      </main>
    );

  return (
    <div className="assignment-submission">
      <BackLink back={back} />
      {submission.assignment && submission.assignment_authorized && (
        <div>
          <h1>{submission.assignment.title}</h1>
          <div>{submission.assignment.body}</div>
        </div>
      )}
      {submission.assignment && !submission.assignment_authorized && (
        <div>
          This assignment is no longer accepting submissions, but you can still
          read or delete this submission.
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
