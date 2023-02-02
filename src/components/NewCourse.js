import { useState } from 'react';
import fetcher from '../fetcher';

import Field from './Field';

export default function NewCourse() {
  const [loading, setLoading] = useState(false);
  const [toValidate, setToValidate] = useState(false);
  const [errors, setErrors] = useState({});

  function handleErrors(data) {
    console.log(data);
    // setErrors(data);
  }

  function completeCreateCourse(data) {}

  function validate(form) {
    setToValidate((validate) => (validate === 'true' ? true : 'true'));
    return form.checkValidity();
  }

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
