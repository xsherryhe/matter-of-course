import { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import fetcher from '../fetcher';

import Field from './Field';
import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';

export default function LogIn() {
  const [loading, setLoading] = useState(false);
  const [toValidate, setToValidate] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const navigate = useNavigate();

  const setMessage = useContext(MessageContext).set;
  const { user, set: setUser } = useContext(UserContext);

  function handleErrors(status, data) {
    if (status === 401) setMessage(<span className="error">{data.error}</span>);
    else setErrors(data);
  }

  function completeLogIn(data) {
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
    const response = await fetcher('users/sign_in', {
      method: 'POST',
      body: new FormData(e.target),
    });
    const data = await response.json();
    if (response.status === 200) completeLogIn(data);
    else handleErrors(response.status, data);
    setLoading(false);
  }

  if (user) {
    setMessage('You are already signed in.');
    return navigate('/');
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h1>Log in</h1>
      <Field
        prefix="user"
        attributes={['login']}
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="user"
        attributes={['password']}
        type="password"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <Field
        prefix="user"
        attributes={['remember_me']}
        type="checkbox"
        errors={errors}
        toValidate={toValidate}
      />
      <button disabled={loading} type="submit">
        Log in
      </button>
    </form>
    // Sign up link
    // Forgot password link
    // Confirmation instructions link
  );
}
