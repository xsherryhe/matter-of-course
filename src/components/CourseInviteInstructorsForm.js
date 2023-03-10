import { useState } from 'react';

import ResourceForm from './ResourceForm';
import { instructorLoginsField } from './CourseForm';

export default function CourseInviteInstructorsForm({
  courseId,
  setCourse = () => {},
}) {
  const [invited, setInvited] = useState(false);

  function completeInvite(data) {
    setCourse(data);
    setInvited(true);
    setTimeout(() => setInvited(false), 2000);
  }

  return (
    <div>
      <ResourceForm
        heading={false}
        flash={false}
        resource="course"
        fields={[instructorLoginsField]}
        action="update"
        id={courseId}
        completeAction={completeInvite}
        submitText="Invite"
      />
      {invited && 'Invited!'}
    </div>
  );
}
