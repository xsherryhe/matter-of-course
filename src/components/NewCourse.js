import { useState } from 'react';
import fetcher from '../fetcher';

import Field from './Field';
import withFormValidation from './higher-order/withFormValidation';

function NewCourseBase({ validate, toValidate, errors, setErrors }) {
  const [loading, setLoading] = useState(false);

  function handleErrors(data) {
    console.log(data);
    // setErrors(data);
  }

  function completeCreateCourse(data) {}

  async function handleSubmit(e) {
    e.preventDefault();
    // if (!validate(e.target)) return;

    setLoading(true);
    const response = await fetcher('courses', {
      method: 'POST',
      body: new FormData(e.target),
    });
    const data = await response.json();
    if (response.status === 200) completeCreateCourse(data);
    else handleErrors(data);
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
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <button disabled={loading} type="submit">
        Create Course
      </button>
    </form>
  );
}

const NewCourse = withFormValidation(NewCourseBase);
export default NewCourse;
