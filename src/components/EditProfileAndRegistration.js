import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import fetcher from '../fetcher';

import PasswordCreationFields from './PasswordCreationFields';
import Field from './Field';
import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';
import withFormValidation from './higher-order/withFormValidation';
import BackLink from './BackLink';
import CancelAccountFlowButton from './CancelAccountFlowButton';
import AvatarField from './AvatarField';

function EditProfileAndRegistrationBase({
  validate,
  toValidate,
  formError,
  errors,
  handleErrors,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setMessage = useContext(MessageContext).set;
  const { user, set: setUser } = useContext(UserContext);

  function updateUser(data) {
    setMessage(data.message);
    setUser(data.user);
    navigate('/me');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!(await validate(e.target))) return;

    setLoading(true);
    const response = await fetcher('users', {
      method: 'PATCH',
      body: new FormData(e.target),
    });
    if (response.status < 400) updateUser(response.data);
    else handleErrors(response);
    setLoading(false);
  }

  return (
    <div>
      <form noValidate onSubmit={handleSubmit}>
        {formError && <div className="error">{formError}</div>}
        <BackLink back={{ route: '/me', location: 'My Profile' }} />
        <h1>Edit Profile and Registration</h1>
        <Field
          type="hidden"
          prefix="user"
          attributes={['profile_attributes', 'id']}
          defaultValue={user?.profile.id}
        />
        <AvatarField
          defaultValues={user}
          prefix="user"
          attributes={['profile_attributes', 'avatar']}
          errors={errors}
          toValidate={toValidate}
        />
        <Field
          prefix="user"
          attributes={['profile_attributes', 'first_name']}
          defaultValue={user?.profile.first_name}
          errors={errors}
          toValidate={toValidate}
          required={true}
        />
        <Field
          prefix="user"
          attributes={['profile_attributes', 'middle_name']}
          defaultValue={user?.profile.middle_name}
          errors={errors}
          toValidate={toValidate}
        />
        <Field
          prefix="user"
          attributes={['profile_attributes', 'last_name']}
          defaultValue={user?.profile.last_name}
          errors={errors}
          toValidate={toValidate}
          required={true}
        />
        <Field
          prefix="user"
          attributes={['email']}
          defaultValue={user?.email}
          type="email"
          errors={errors}
          toValidate={toValidate}
          required={true}
        />
        <div>Username (Cannot be changed): {user?.username}</div>
        <PasswordCreationFields
          prefix="user"
          labelText="New Password (Leave blank if you don't want to change it)"
          confirmationLabelText="New Password Confirmation"
          errors={errors}
          toValidate={toValidate}
          required={false}
        />
        <Field
          prefix="user"
          type="password"
          labelText="Current Password (Needed to confirm changes)"
          attributes={['current_password']}
          errors={errors}
          toValidate={toValidate}
          required={true}
        />
        <button disabled={loading} type="submit">
          Update
        </button>
      </form>
      <div>
        <h2>Cancel My Account</h2>
        <CancelAccountFlowButton />
      </div>
    </div>
  );
}

const EditProfileAndRegistration = withFormValidation(
  EditProfileAndRegistrationBase
);
export default EditProfileAndRegistration;
