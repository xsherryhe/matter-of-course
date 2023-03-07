import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import fetcher from '../fetcher';

import Field from './Field';
import PasswordCreationFields from './PasswordCreationFields';
import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';
import withFormValidation from './higher-order/withFormValidation';

function EditPasswordBase({
  validate,
  toValidate,
  formError,
  errors,
  handleErrors,
}) {
  const [searchParams] = useSearchParams();
  const resetPasswordToken = searchParams.get('reset-password-token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const setMessage = useContext(MessageContext).set;
  const setUser = useContext(UserContext).set;

  useEffect(() => {
    if (!resetPasswordToken) navigate('/forgot-password');
  }, [resetPasswordToken, navigate]);

  function updatePassword(data) {
    setMessage(data.message);
    setUser(data.user);
    navigate('/');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!(await validate(e.target))) return;

    setLoading(true);
    const response = await fetcher('users/password', {
      method: 'PATCH',
      body: new FormData(e.target),
    });
    if (response.status < 400) updatePassword(response.data);
    else handleErrors(response);
    setLoading(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
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
      <button disabled={loading} type="submit">
        Change My Password
      </button>
    </form>
  );
}

const EditPassword = withFormValidation(EditPasswordBase);
export default EditPassword;
