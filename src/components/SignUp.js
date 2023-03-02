import { useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import fetcher from '../fetcher';

import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';
import Field from './Field';
import PasswordCreationFields from './PasswordCreationFields';
import withLogInCheck from './higher-order/withLogInCheck';
import withFormValidation from './higher-order/withFormValidation';

function SignUpBase({
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

  function completeSignUp(data) {
    setMessage(data.message);
    setUser(data.user);
    navigate('/' + from.replace(/_/g, '/'), { state });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!(await validate(e.target))) return;

    setLoading(true);
    if (await loggedIn()) return setLoading(false);

    const response = await fetcher('users', {
      method: 'POST',
      body: new FormData(e.target),
    });
    if (response.status < 400) completeSignUp(response.data);
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

const SignUp = withFormValidation(withLogInCheck(SignUpBase));
export default SignUp;
