import { useState } from 'react';
import { getUniqueBy } from '../utilities';
import CourseAvatarAndTitle from './CourseAvatarAndTitle';

import ResourceForm from './ResourceForm';

export default function CancelAccountHostedCourse({
  course,
  setConflictingCourses,
}) {
  const [resolved, setResolved] = useState(false);

  function resolveCourse() {
    setResolved(true);
    setTimeout(
      () =>
        setConflictingCourses((courses) => ({
          ...courses,
          hosted: courses.hosted.filter(({ id }) => id !== course.id),
        })),
      2000
    );
  }

  const otherInstructors = course.instructors.filter(
    ({ id }) => id !== course.host.id
  );

  const hostSelectField = {
    attribute: 'host_id',
    type: 'select',
    attributeText: 'New Host',
    valueOptions: getUniqueBy(otherInstructors, 'id').map(({ id, name }) => ({
      name,
      value: id,
    })),
  };

  if (!otherInstructors.length) return null;
  if (resolved) return <div>Host changed!</div>;
  return (
    <div>
      <h3>
        <CourseAvatarAndTitle course={course} />
      </h3>
      <ResourceForm
        heading={false}
        flash={false}
        resource="course"
        fields={[hostSelectField]}
        action="update"
        id={course.id}
        completeAction={resolveCourse}
        submitText="Submit Change"
      />
    </div>
  );
}
