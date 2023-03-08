import { getUniqueBy } from '../utilities';
import ResourceForm from './ResourceForm';

export const hostSelectField = (defaultValues) => ({
  attribute: 'host_id',
  type: 'select',
  labelText: 'Host (Changing this will remove you as the host)',
  attributeText: 'Host',
  valueOptions: getUniqueBy(
    [defaultValues.host, ...defaultValues.instructors],
    'id'
  ).map(({ id, name }) => ({
    name,
    value: id,
  })),
});

export const instructorLoginsField = {
  attribute: 'instructor_logins',
  value: (_defaultValues, errors) =>
    (errors?.instructor_logins?.valid || []).join(', '),
  type: 'textarea',
  labelText: 'Invite Instructors (Username or email, comma-separated)',
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

export default function CourseForm({ action, defaultValues, ...props }) {
  const fields = [
    { attribute: 'title', required: true },
    { attribute: 'description', type: 'textarea', required: true },
    instructorLoginsField,
  ];
  if (defaultValues?.hosted) fields.push(hostSelectField(defaultValues));

  return (
    <ResourceForm
      resource="course"
      action={action}
      defaultValues={defaultValues}
      fields={fields}
      flash={(data) =>
        data.authorized
          ? `Successfully ${action}d course.`
          : 'You are no longer a host or instructor for this course.'
      }
      {...props}
    />
  );
}
