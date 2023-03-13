import '../styles/CourseOverview.css';
import { capitalize } from '../utilities';

import CourseStatusButton from './CourseStatusButton';
import LeaveInstructorButton from './LeaveInstructorButton';
import CourseEnrollButton from './CourseEnrollButton';
import CourseMessageButton from './CourseMessageButton';
import CourseInvitedInstructors from './CourseInvitedInstructors';
import User from './User';
import List from './List';

export default function CourseOverview({
  course,
  setCourse,
  editButton,
  editForm,
  deleteButton,
}) {
  const {
    host,
    instructors,
    instruction_invitations: instructionInvitations,
    status,
    description,
    authorized,
  } = course;

  if (editForm) return editForm;

  return (
    <div className="course-overview">
      <CourseEnrollButton course={course} setCourse={setCourse} />
      <CourseMessageButton course={course} />
      {authorized && (
        <div>
          {editButton}
          <CourseStatusButton course={course} setCourse={setCourse} />
          <LeaveInstructorButton course={course} setCourse={setCourse} />
          {deleteButton}
        </div>
      )}
      <div className="host">
        Host: <User user={host} />
      </div>
      <div className="instructors">
        Instructors:{' '}
        <List
          items={instructors.map((instructor) => (
            <User key={instructor.id} user={instructor} />
          ))}
        />
      </div>
      {authorized && (
        <CourseInvitedInstructors invitations={instructionInvitations} />
      )}
      <div>Status: {capitalize(status)}</div>
      <div>{description}</div>
    </div>
  );
}
