import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetcher from '../fetcher';
import MessageContext from './contexts/MessageContext';

import Field from './Field';
import withFormValidation from './higher-order/withFormValidation';

function NewCourseBase({ validate, toValidate, errors, handleErrors }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setMessage = useContext(MessageContext).set;

  // TO DO: Navigate to new course
  function completeCreateCourse(data) {
    setMessage('You successfully created a new course!');
    navigate(`/course/${data.id}`, { state: { courseData: data } });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate(e.target)) return;

    setLoading(true);
    const response = await fetcher('courses', {
      method: 'POST',
      body: new FormData(e.target),
    });
    const data = await response.json();
    if (response.status < 400) completeCreateCourse(data);
    else handleErrors(data, response.status);
    setLoading(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h1>Create a New Course</h1>
      <Field
        prefix="course"
        attributes={['title']}
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="course"
        attributes={['description']}
        type="textarea"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="course"
        attributes={['instructor_logins']}
        type="textarea"
        labelText="Instructors (username or email, comma-separated)"
        attributeText="Instructors"
        errors={errors}
        toValidate={toValidate}
      />
      <button disabled={loading} type="submit">
        Create Course
      </button>
    </form>
  );
}

const NewCourse = withFormValidation(NewCourseBase, { authenticated: true });
export default NewCourse;
