import { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import fetcher from '../fetcher';

import Field from './Field';
import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';
import withFormValidation from './higher-order/withFormValidation';

function LogInBase({ validate, toValidate, formError, errors, handleErrors }) {
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
    if (user) return;
    if (!(await validate(e.target))) return;

    setLoading(true);
    const response = await fetcher('users/sign_in', {
      method: 'POST',
      body: new FormData(e.target),
    });
    if (response.status < 400) completeLogIn(response.data);
    else handleErrors(response);
    setLoading(false);
  }

  useEffect(() => {
    if (!user) return;

    setMessage('You are already signed in.');
    navigate('/');
  }, [user, setMessage, navigate]);

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

const LogIn = withFormValidation(LogInBase);
export default LogIn;
