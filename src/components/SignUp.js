import { useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import fetcher from '../fetcher';
import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';
import Field from './Field';
import PasswordCreationFields from './PasswordCreationFields';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [toValidate, setToValidate] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const navigate = useNavigate();

  const setMessage = useContext(MessageContext).set;
  const { user, set: setUser } = useContext(UserContext);

  function handleErrors(data) {
    setErrors(data);
  }

  function completeSignUp(data) {
    setMessage(data.message);
    setUser(data.user);
    navigate('/' + from);
  }

  function validate(form) {
    setToValidate((validate) => (validate === 'true' ? true : 'true'));
    return form.checkValidity();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate(e.target)) return;

    setLoading(true);
    const response = await fetcher('users', {
      method: 'POST',
      body: new FormData(e.target),
    });
    const data = await response.json();
    if (response.status === 200) completeSignUp(data);
    else handleErrors(data);
    setLoading(false);
  }

  if (user) {
    setMessage('You are already signed in.');
    return navigate('/');
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      <Field
        prefix="user"
        attributes={['profile_attributes', 'first_name']}
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="user"
        attributes={['profile_attributes', 'middle_name']}
        errors={errors}
        toValidate={toValidate}
      />
      <Field
        prefix="user"
        attributes={['profile_attributes', 'last_name']}
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="user"
        attributes={['email']}
        type="email"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="user"
        attributes={['username']}
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <PasswordCreationFields
        prefix="user"
        errors={errors}
        toValidate={toValidate}
      />
      <button disabled={loading} type="submit">
        Sign up
      </button>
    </form>
    // Log in link
    // Forgot password link
    // Confirmation instructions link
  );
}