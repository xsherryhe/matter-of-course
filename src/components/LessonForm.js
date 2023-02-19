import { useCallback } from 'react';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import fetcher from '../fetcher';

import MessageContext from './contexts/MessageContext';
import ResourceForm from './ResourceForm';

export const assignmentsFields = {
  nested: {
    resource: 'assignments',
    resourceText: 'Assignment',
    resourceTitleAttribute: 'title',
    heading: 'Assignments',
    multiple: true,
    initialInstanceCount: 0,
    fields: [
      {
        attribute: 'order',
        type: 'select',
        order: true,
        attributeText: 'Assignment #',
        required: true,
      },
      {
        attribute: 'title',
        attributeText: 'Assignment Title',
        required: true,
      },
      {
        attribute: 'body',
        type: 'textarea',
        attributeText: 'Instructions',
        required: true,
      },
    ],
  },
};

export default function LessonForm({ defaultValues, action, ...props }) {
  const initialCourse = useLocation().state?.course;
  const { courseId: initialCourseId } = useParams();
  const courseId = initialCourseId || defaultValues?.course_id;
  const [course, setCourse] = useState(initialCourse);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const setMessage = useContext(MessageContext).set;
  const redirectUnauthorized = useCallback(() => {
    setMessage(
      <span className="error">
        You are unauthorized to edit lessons for that course.
      </span>
    );
    navigate('/home');
  }, [setMessage, navigate]);

  useEffect(() => {
    if (initialCourse) return;

    function handleErrors({ status, data }) {
      if (status === 401) redirectUnauthorized();
      else if (data.error) setError(data.error);
    }

    async function getCourse() {
      const response = await fetcher(`courses/${courseId}`);
      if (response.status < 400) setCourse(response.data);
      else handleErrors(response);
    }
    getCourse();
  }, [initialCourse, courseId, redirectUnauthorized]);

  useEffect(() => {
    if (course && !course.authorized) redirectUnauthorized();
  }, [course, setMessage, redirectUnauthorized]);

  const fields = [
    { attribute: 'title', attributeText: 'Lesson Title', required: true },
    {
      attribute: 'course',
      type: 'immutable',
      labelText: 'Course: ',
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
        heading: 'Lesson Content',
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
    assignmentsFields,
  ];

  if (error) return <div className="error">{error}</div>;
  if (!course || !course.authorized) return 'Loading...';

  return (
    <ResourceForm
      resource="lesson"
      fields={fields}
      defaultValues={defaultValues}
      action={action}
      heading={`Lesson for ${course.title}`}
      navPrefix={`/course/${course.id}`}
      routePrefix={action === 'create' ? `courses/${course.id}/` : ''}
      back={{ location: 'Course', route: `/course/${courseId}` }}
      {...props}
    />
  );
}
