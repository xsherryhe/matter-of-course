import { useState } from 'react';
import fetcher from '../fetcher';
import Field from './Field';
import PasswordCreationFields from './PasswordCreationFields';

export default function SignUp() {
  const [toValidate, setToValidate] = useState(false);
  const [errors, setErrors] = useState({});

  function handleErrors(data) {
    setErrors(data);
  }

  function completeSignUp(data) {
    console.log(data);
  }

  function validate(form) {
    setToValidate((validate) => (validate === 'true' ? true : 'true'));
    return form.checkValidity();
  }

  // TO DO: client side validation
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate(e.target)) return;

    const response = await fetcher('users', {
      method: 'POST',
      body: new FormData(e.target),
    });
    const data = await response.json();
    if (response.status === 200) completeSignUp(data);
    else handleErrors(data);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      <Field
        prefix="user"
        attribute="first_name"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="user"
        attribute="middle_name"
        errors={errors}
        toValidate={toValidate}
      />
      <Field
        prefix="user"
        attribute="last_name"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="user"
        attribute="email"
        type="email"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="user"
        attribute="username"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <PasswordCreationFields
        prefix="user"
        errors={errors}
        toValidate={toValidate}
      />
      <button type="submit">Sign up</button>
    </form>
    // Log in link
    // Forgot password link
    // Confirmation instructions link
  );
}
