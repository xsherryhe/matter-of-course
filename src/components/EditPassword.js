import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetcher from '../fetcher';

import Field from './Field';
import PasswordCreationFields from './PasswordCreationFields';
import MessageContext from './contexts/MessageContext';

export default function EditPassword({
  validate,
  toValidate,
  formError,
  errors,
  handleErrors,
}) {
  const { resetPasswordToken } = useParams();
  const navigate = useNavigate();
  const setMessage = useContext(MessageContext).set;

  useEffect(() => {
    if (!resetPasswordToken) navigate('/forgot-password');
  }, [resetPasswordToken, navigate]);

  function updatePassword(data) {
    setMessage(data.message);
    navigate('/');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!(await validate(e.target))) return;

    const response = await fetcher('users/password', {
      method: 'PATCH',
      body: new FormData(e.target),
    });
    if (response.status < 400) updatePassword(response.data);
    else handleErrors(response);
  }

  return (
    <form onSubmit={handleSubmit}>
      {formError && <div className="error">{formError}</div>}
      <h1>Change your password</h1>
      <Field
        type="hidden"
        prefix="user"
        attributes={['reset_password_token']}
        value={resetPasswordToken}
        errors={errors}
        toValidate={toValidate}
      />
      <PasswordCreationFields
        prefix="user"
        labelText="New Password"
        confirmationLabelText="New Password Confirmation"
        errors={errors}
        toValidate={toValidate}
        required={true}
      />
      <button type="submit">Change My Password</button>
    </form>
  );
}
