import ResourceForm from './ResourceForm';

export default function CourseForm(props) {
  const fields = [
    { attribute: 'title', required: true },
    { attribute: 'description', type: 'textarea', required: true },
    {
      attribute: 'instructor_logins',
      defaultValue: (defaultValues) =>
        defaultValues.instructors?.map(({ username }) => username)?.join(', '),
      type: 'textarea',
      labelText: 'Instructors (username or email, comma-separated)',
      attributeText: 'Instructors',
    },
  ];

  return (
    <ResourceForm
      resource="course"
      fields={fields}
      heading={false}
      {...props}
    />
  );
}
