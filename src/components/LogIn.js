import { useState, useContext } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import fetcher from '../fetcher';

import Field from './Field';
import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';
import withLogInCheck from './higher-order/withLogInCheck';
import withFormValidation from './higher-order/withFormValidation';

function LogInBase({
  loggedIn,
  validate,
  toValidate,
  formError,
  errors,
  handleErrors,
}) {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const state = useLocation().state;
  const navigate = useNavigate();

  const setMessage = useContext(MessageContext).set;
  const { user, set: setUser } = useContext(UserContext);

  function completeLogIn(data) {
    setMessage(data.message);
    setUser(data.user);
    navigate('/' + from.replace(/_/g, '/'), { state });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate(e.target)) return;

    setLoading(true);
    if (await loggedIn()) return setLoading(false);

    const response = await fetcher('users/sign_in', {
      method: 'POST',
      body: new FormData(e.target),
    });
    if (response.status < 400) completeLogIn(response.data);
    else handleErrors(response);
    setLoading(false);
  }

  if (user) {
    setMessage('You are already signed in.');
    return navigate('/');
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      {formError && <div className="error">{formError}</div>}
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

const LogIn = withFormValidation(withLogInCheck(LogInBase));
export default LogIn;
