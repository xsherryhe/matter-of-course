import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import BackLink from './BackLink';
import MessageContext from './contexts/MessageContext';

import Field from './Field';
import withErrorHandling from './higher-order/withErrorHandling';
import withFormValidation from './higher-order/withFormValidation';
import NavButton from './NavButton';

function AssignmentSubmissionFormBase({
  heading = true,
  defaultValues = {},
  action: initialAction,
  back: propsBack = true,
  close,
  completeAction,
  deleteButton,
  validate: validateForm,
  toValidate,
  formError: propsFormError,
  errors,
  handleErrors: handleFormErrors,
  handleAssignmentErrors,
}) {
  const state = useLocation().state;
  const back = propsBack && (propsBack.route ? propsBack : state?.back);
  const initialAssignment = state?.assignment || defaultValues.assignment;
  const { assignmentId } = useParams();
  const [action, setAction] = useState(initialAction);
  const [assignment, setAssignment] = useState(initialAssignment);
  const [submission, setSubmission] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState(defaultValues.body);
  const [saved, setSaved] = useState(false);
  const [stateFormError, setStateFormError] = useState(null);
  const formError = propsFormError || stateFormError;

  const setMessage = useContext(MessageContext).set;
  const navigate = useNavigate();

  const { id, authorized: submissionAuthorized } = submission;
  const authorized =
    (action === 'create' && assignment) || submissionAuthorized;

  useEffect(() => {
    if (initialAssignment || action === 'update' || !assignmentId) return;

    async function getAssignment() {
      const response = await fetcher(`assignments/${assignmentId}`);
      if (response.status < 400) setAssignment(response.data);
      else handleAssignmentErrors(response);
    }
    getAssignment();
  }, [initialAssignment, assignmentId, action, handleAssignmentErrors]);

  function updateBody(e) {
    setBody(e.target.value);
    setSaved(false);
  }

  function validate(form, changeToComplete) {
    if (!validateForm(form)) return false;
    if (!assignment) {
      setStateFormError('This assignment no longer exists.');
      return false;
    }
    if (!authorized) {
      setStateFormError('You are not authorized to edit this submission.');
    }
    if (changeToComplete && !body) {
      setStateFormError('Please fill out the assignment before submitting it.');
      return false;
    }
    return true;
  }

  function handleErrors(response) {
    if (response.data.student.includes('is not unique'))
      setStateFormError(
        'You have already started or completed this assignment.'
      );
    handleFormErrors(response);
  }

  function handleSubmit(changeToComplete) {
    return async function (e) {
      e.preventDefault();
      const form = e.target.closest('form');
      if (!validate(form, changeToComplete)) return;

      const formData = new FormData(form);
      if (changeToComplete)
        formData.append('assignment_submission[completion_status]', 'complete');

      setLoading(true);
      const response = await fetcher(
        `assignments/${assignment.id}/submissions${id ? `/${id}` : ''}`,
        {
          method: { create: 'POST', update: 'PATCH' }[action],
          body: formData,
        }
      );
      if (response.status < 400) {
        setSaved(true);
        setSubmission(response.data);
        setAction('update');

        if (completeAction) completeAction(response.data);
        if (changeToComplete) {
          setMessage(
            `Assignment ${
              defaultValues.completion_status === 'complete'
                ? 'updated'
                : 'submitted'
            }.`
          );
          navigate(`/assignment/${response.data.id}`, {
            state: { assignment, submissionData: response.data, back },
          });
        }
      } else handleErrors(response);
      setLoading(false);
    };
  }

  return (
    <form noValidate>
      {back && <BackLink back={back} />}
      {close && (
        <button className="close" onClick={close}>
          X
        </button>
      )}
      {heading && assignment && (
        <div>
          <h1>{assignment.title}</h1>
          <div>{assignment.body}</div>
        </div>
      )}
      <Field
        prefix="assignment_submission"
        attributes={['body']}
        defaultValue={defaultValues.body}
        type="textarea"
        labelText=""
        attributeText="Submission"
        onChange={updateBody}
        errors={errors}
        toValidate={toValidate}
      />
      <div className="buttons">
        {deleteButton}
        {!(defaultValues.completion_status === 'complete') && (
          <button
            onClick={handleSubmit(false)}
            disabled={saved || loading || !assignment || !authorized}
          >
            {saved ? 'Saved' : 'Save Without Submitting'}
          </button>
        )}
        <NavButton
          onClick={handleSubmit(true)}
          disabled={loading || !assignment || !authorized}
        >
          Submit
        </NavButton>
      </div>
      {formError && <div className="error">{formError}</div>}
    </form>
  );
}

const ValidatedAssignmentSubmissionForm = withFormValidation(
  AssignmentSubmissionFormBase
);

const AssignmentSubmissionForm = withErrorHandling(
  ValidatedAssignmentSubmissionForm,
  {
    resourceName: 'assignment',
    redirect: { route: '/my-assignments', location: 'My Assignments' },
  }
);
export default AssignmentSubmissionForm;
