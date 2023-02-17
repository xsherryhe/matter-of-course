import { capitalize, list } from '../utilities';

import CourseStatusButton from './CourseStatusButton';
import LeaveInstructorButton from './LeaveInstructorButton';
import CourseEnrollButton from './CourseEnrollButton';
import CoursePostsButton from './CoursePostsButton';
import CourseMessageButton from './CourseMessageButton';
import CourseInvitedInstructors from './CourseInvitedInstructors';

export default function CourseOverview({
  course,
  setCourse,
  setError,
  editButton,
  editForm,
  deleteButton,
}) {
  const {
    host,
    instructors,
    instruction_invitations,
    status,
    description,
    authorized,
  } = course;

  if (editForm) return editForm;

  return (
    <div>
      <CourseEnrollButton course={course} setCourse={setCourse} />
      <CoursePostsButton course={course} />
      <CourseMessageButton course={course} />
      {authorized && (
        <div>
          {editButton}
          <CourseStatusButton course={course} setCourse={setCourse} />
          <LeaveInstructorButton
            course={course}
            setCourse={setCourse}
            setCourseError={setError}
          />
          {deleteButton}
        </div>
      )}
      <div>Host: {host.name}</div>
      <div>Instructors: {list(instructors.map(({ name }) => name))}</div>
      {authorized && (
        <CourseInvitedInstructors invitations={instruction_invitations} />
      )}
      <div>Status: {capitalize(status)}</div>
      <div>{description}</div>
    </div>
  );
}
