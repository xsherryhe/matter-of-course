import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import MessageContext from './contexts/MessageContext';
import Field from './Field';
import withFormValidation from './higher-order/withFormValidation';

function CourseFormBase({
  validate,
  toValidate,
  errors,
  handleErrors,
  action,
  defaultValues = {},
  id,
  completeAction,
}) {
  const preAction = { create: 'new', update: 'edit' }[action];
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setMessage = useContext(MessageContext).set;

  // TO DO: Navigate to new course
  function completeCourseAction(data) {
    setMessage(`Successfully ${action}d course.`);
    if (completeAction) completeAction(data);
    else navigate(`/course/${id || data.id}`, { state: { courseData: data } });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate(e.target)) return;

    setLoading(true);
    const response = await fetcher(`courses${id ? `/${id}` : ''}`, {
      method: { create: 'POST', update: 'PATCH' }[action],
      body: new FormData(e.target),
    });
    const data = await response.json();
    if (response.status < 400) completeCourseAction(data);
    else handleErrors(data, response.status);
    setLoading(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h1>{capitalize(preAction)} Course</h1>
      <Field
        prefix="course"
        attributes={['title']}
        defaultValue={defaultValues.title}
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="course"
        attributes={['description']}
        defaultValue={defaultValues.description}
        type="textarea"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="course"
        attributes={['instructor_logins']}
        defaultValue={defaultValues.instructors
          ?.map(({ username }) => username)
          ?.join(', ')}
        type="textarea"
        labelText="Instructors (username or email, comma-separated)"
        attributeText="Instructors"
        errors={errors}
        toValidate={toValidate}
      />
      <button disabled={loading} type="submit">
        {capitalize(action)} Course
      </button>
    </form>
  );
}

const CourseForm = withFormValidation(CourseFormBase, { authenticated: true });
export default CourseForm;
