import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import fetcher from '../fetcher';

import withFormValidation from './higher-order/withFormValidation';
import MessageContext from './contexts/MessageContext';
import Field from './Field';

function ForgotPasswordBase({
  validate,
  toValidate,
  formError,
  errors,
  handleErrors,
}) {
  const navigate = useNavigate();
  const setMessage = useContext(MessageContext).set;

  function completeSendResetPasswordInstructions() {
    setMessage('Reset password instructions have been sent to your email.');
    navigate('/');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!(await validate(e.target))) return;

    const response = await fetcher('users/password', {
      method: 'POST',
      body: new FormData(e.target),
    });
    if (response.status < 400) completeSendResetPasswordInstructions();
    else handleErrors(response);
  }

  return (
    <div>
      <h1>Forgot your password?</h1>
      {formError && <div className="error">{formError}</div>}
      <form noValidate onSubmit={handleSubmit}>
        <Field
          prefix="user"
          attributes={['email']}
          type="email"
          errors={errors}
          toValidate={toValidate}
          required={true}
        />
        <button type="submit">Send me reset password instructions</button>
      </form>
    </div>
  );
}

const ForgotPassword = withFormValidation(ForgotPasswordBase);
export default ForgotPassword;
