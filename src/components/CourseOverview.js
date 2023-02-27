import { capitalize, list } from '../utilities';

import CourseStatusButton from './CourseStatusButton';
import LeaveInstructorButton from './LeaveInstructorButton';
import CourseEnrollButton from './CourseEnrollButton';
import CourseMessageButton from './CourseMessageButton';
import CourseInvitedInstructors from './CourseInvitedInstructors';

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
    <div>
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
      <div>Host: {host.name}</div>
      <div>Instructors: {list(instructors.map(({ name }) => name))}</div>
      {authorized && (
        <CourseInvitedInstructors invitations={instructionInvitations} />
      )}
      <div>Status: {capitalize(status)}</div>
      <div>{description}</div>
    </div>
  );
}
