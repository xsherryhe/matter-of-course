import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fetcher from '../fetcher';

import withErrorHandling from './higher-order/withErrorHandling';
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

function LessonFormBase({
  defaultValues,
  action,
  handleErrors,
  redirectUnauthorized,
  ...props
}) {
  const initialCourse = useLocation().state?.course;
  const { courseId: initialCourseId } = useParams();
  const courseId = initialCourseId || defaultValues?.course_id;
  const [course, setCourse] = useState(initialCourse);

  useEffect(() => {
    if (initialCourse) return;

    async function getCourse() {
      const response = await fetcher(`courses/${courseId}`);
      if (response.status < 400) setCourse(response.data);
      else handleErrors(response);
    }
    getCourse();
  }, [initialCourse, courseId, handleErrors]);

  useEffect(() => {
    if (course && !course.authorized)
      redirectUnauthorized(
        'You are unauthorized to edit lessons for that course.'
      );
  }, [course, redirectUnauthorized]);

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

const LessonForm = withErrorHandling(LessonFormBase);
export default LessonForm;
