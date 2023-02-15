import ResourceForm from './ResourceForm';

export const instructorLoginsField = {
  attribute: 'instructor_logins',
  value: (_defaultValues, errors) =>
    (errors?.instructor_logins?.valid || []).join(', '),
  type: 'textarea',
  labelText: 'Invite Instructors (username or email, comma-separated)',
  attributeText: 'Instructors',
  handleFieldErrors: (errors) =>
    errors.instructor_logins && (
      <div>
        The following instructors were removed:
        {Object.entries(errors.instructor_logins.invalid).map((login) => (
          <div key={login[0]}>{login.join(' ')}</div>
        ))}
      </div>
    ),
};

export default function CourseForm(props) {
  const fields = [
    { attribute: 'title', required: true },
    { attribute: 'description', type: 'textarea', required: true },
    instructorLoginsField,
  ];

  return <ResourceForm resource="course" fields={fields} {...props} />;
}
