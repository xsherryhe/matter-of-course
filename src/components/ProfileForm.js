import PasswordCreationFields from './PasswordCreationFields';
import ResourceForm from './ResourceForm';

export default function ProfileForm(props) {
  const fields = [
    {
      nested: {
        resource: 'profile',
        resourceText: '',
        multiple: false,
        fields: [
          { attribute: 'first_name', required: true },
          { attribute: 'middle_name' },
          { attribute: 'last_name', required: true },
        ],
      },
    },
    { attribute: 'email', type: 'email', required: true },
    {
      attribute: 'username',
      labelText: 'Username (Cannot be changed): ',
      type: 'immutable',
    },
    {
      attribute: 'password',
      labelText: "New Password (Leave blank if you don't want to change it)",
      required: false,
      Component: PasswordCreationFields,
    },
    {
      attribute: 'current_password',
      labelText: 'Current Password (Needed to confirm changes)',
      type: 'password',
      required: true,
    },
  ];

  return (
    <ResourceForm
      resource="user"
      route="users"
      fields={fields}
      flash={(data) => data.message}
      {...props}
    />
  );
}
