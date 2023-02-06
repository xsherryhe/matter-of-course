import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import ResourceForm from './ResourceForm';

export default function LessonForm(props) {
  const { course: initialCourse } = useLocation()?.state;
  const { id } = useParams();
  const [course, setCourse] = useState(initialCourse);
  const [error, setError] = useState(null);

  function handleErrors(data, status) {
    if (status === 401)
      setError('You are unauthorized to create a lesson for this course.');
    else if (data.error) setError(data.error);
  }

  useEffect(() => {
    if (initialCourse) return;

    async function getCourseTitle() {
      const response = await fetcher(`courses/${id}`);
      const data = await response.json();
      if (response.status < 400) setCourse(data);
      else handleErrors(data, response.status);
    }
    getCourseTitle();
  }, [initialCourse, id]);

  if (error) return <div className="error">{error}</div>;
  if (!course) return 'Loading...';

  const fields = [
    {
      attribute: 'course',
      type: 'immutable',
      defaultValue: () => course.title,
    },
    { attribute: 'title', attributeText: 'Lesson Title', required: true },
    {
      nested: {
        resource: 'lesson_sections',
        resourceText: 'Section',
        multiple: true,
        fields: [
          {
            attribute: 'order',
            type: 'select',
            order: true,
            labelText: 'Section #',
          },
          {
            attribute: 'title',
            required: true,
          },
          {
            attribute: 'body',
            type: 'textarea',
            labelText: 'Write Section',
            required: true,
          },
        ],
      },
    },
  ];

  return (
    <ResourceForm
      resource="lesson"
      fields={fields}
      heading={`Lesson for ${course.title}`}
      routePrefix={`courses/${course.id}/`}
      {...props}
    />
  );
}
