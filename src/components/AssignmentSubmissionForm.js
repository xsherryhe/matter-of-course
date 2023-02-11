import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import MessageContext from './contexts/MessageContext';

import Field from './Field';
import withFormValidation from './higher-order/withFormValidation';
import NavButton from './NavButton';

function AssignmentSubmissionFormBase({
  heading = true,
  defaultValues = {},
  action,
  id,
  close,
  completeAction,
  deleteButton,
  validate: validateForm,
  toValidate,
  errors,
  handleErrors,
}) {
  const initialAssignment =
    useLocation().state?.assignment || defaultValues.assignment;
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(initialAssignment);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState(defaultValues.body);
  const [saved, setSaved] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [formError, setFormError] = useState(null);

  const setMessage = useContext(MessageContext).set;
  const navigate = useNavigate();

  function handleAssignmentErrors({ data }) {
    if (data.error) setPageError(data.error);
  }

  useEffect(() => {
    if (initialAssignment || action === 'update' || !assignmentId) return;

    async function getAssignment() {
      const response = await fetcher(`assignments/${assignmentId}`);
      if (response.status < 400) setAssignment(response.data);
      else handleAssignmentErrors(response);
    }
    getAssignment();
  }, [initialAssignment, assignmentId, action]);

  function updateBody(e) {
    setBody(e.target.value);
    setSaved(false);
  }

  function validate(form, changeToComplete) {
    if (!validateForm(form)) return false;
    if (!assignment) {
      setFormError('This assignment no longer exists.');
      return false;
    }
    if (changeToComplete && !body) {
      setFormError('Please fill out the assignment before submitting it.');
      return false;
    }
    return true;
  }

  function handleFormErrors({ data }) {
    if (data.error) setFormError(data.error);
    else handleErrors(data);
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
            state: { assignment, submissionData: response.data },
          });
        }
      } else handleFormErrors(response);
      setLoading(false);
    };
  }

  if (pageError) return <div className="error">{pageError}</div>;
  return (
    <form noValidate>
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
            disabled={saved || loading || !assignment}
          >
            {saved ? 'Saved' : 'Save Without Submitting'}
          </button>
        )}
        <NavButton
          onClick={handleSubmit(true)}
          disabled={loading || !assignment}
        >
          Submit
        </NavButton>
      </div>
      {formError && <div className="error">{formError}</div>}
    </form>
  );
  // Don't use resource form
  // If the assignment no longer exists
  // *submit buttons disabled={!Boolean(assignment)}
  // *validate on front end and don't allow update
  // *validate on back end with error handling from Assignment.find
  // different complete action for save vs submit
  // *save: change button text to saved and disabled, and unsave on change of any field
  // *submit: set an "Assignment (submitted / updated)" flash notice
  // *specific validation for submit for body to not be blank
  // *DO use withFormValidation
}

const AssignmentSubmissionForm = withFormValidation(
  AssignmentSubmissionFormBase
);
export default AssignmentSubmissionForm;
