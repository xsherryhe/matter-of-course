import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import ResourceForm from './ResourceForm';

export default function LessonForm(props) {
  const initialCourse = useLocation()?.state?.course;
  const { courseId } = useParams();
  const [course, setCourse] = useState(initialCourse);
  const [error, setError] = useState(null);

  function handleErrors({ status, data }) {
    if (status === 401)
      setError('You are unauthorized to create a lesson for this course.');
    else if (data.error) setError(data.error);
  }

  useEffect(() => {
    if (initialCourse) return;

    async function getCourse() {
      const response = await fetcher(`courses/${courseId}`);
      if (response.status < 400) setCourse(response.data);
      else handleErrors(response);
    }
    getCourse();
  }, [initialCourse, courseId]);

  if (error) return <div className="error">{error}</div>;
  if (!course) return 'Loading...';

  const fields = [
    { attribute: 'title', attributeText: 'Lesson Title', required: true },
    {
      attribute: 'course',
      type: 'immutable',
      defaultValue: () => course.title,
    },
    {
      attribute: 'order',
      type: 'hidden',
      defaultValue: (defaultValues) =>
        defaultValues.order || course.lessons.length + 1,
    },
    {
      nested: {
        resource: 'lesson_sections',
        resourceText: 'Section',
        resourceTitleAttribute: 'title',
        multiple: true,
        fields: [
          {
            attribute: 'order',
            type: 'select',
            order: true,
            attributeText: 'Section #',
            required: true,
          },
          {
            attribute: 'title',
            attributeText: 'Section Title',
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
      navPrefix={`/course/${course.id}`}
      routePrefix={`courses/${course.id}/`}
      {...props}
    />
  );
}
