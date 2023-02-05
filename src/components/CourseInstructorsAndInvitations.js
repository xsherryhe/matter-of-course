import { useState } from 'react';

import CourseInstructors from './CourseInstructors';
import CourseInvitedInstructors from './CourseInvitedInstructors';

export default function CourseInstructorsAndInvitations({ course }) {
  const [invitations, setInvitations] = useState(
    course.instruction_invitations
  );

  return (
    <div>
      <CourseInstructors
        course={course}
        edit={{ invitations: setInvitations }}
      />
      {course.authorized && (
        <CourseInvitedInstructors invitations={invitations} />
      )}
    </div>
  );
}
