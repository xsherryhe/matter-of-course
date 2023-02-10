import { useState } from 'react';
import { capitalize } from '../utilities';

import CourseStatusNotice from './CourseStatusNotice';
import CourseForm from './CourseForm';
import asResource from './higher-order/asResource';
import CourseInstructors from './CourseInstructors';
import CourseInvitedInstructors from './CourseInvitedInstructors';
import LeaveInstructorButton from './LeaveInstructorButton';
import CourseLessons from './CourseLessons';
import CourseStatusButton from './CourseStatusButton';
import CourseEnrollButton from './CourseEnrollButton';
import CourseRoster from './CourseRoster';
import NavButton from './NavButton';
import CourseAssignments from './CourseAssignments';

function CourseBase({
  resource: course,
  setResource: setCourse,
  error,
  setError,
  editForm,
  editButton,
  deleteButton,
}) {
  const [rosterOn, setRosterOn] = useState(false);

  function showRoster() {
    setRosterOn(true);
  }

  function hideRoster() {
    setRosterOn(false);
  }

  if (error) {
    // TO DO: Link to host
    if (error.status === 401) {
      let message = `This course is ${error.data.status}.`;
      if (error.data.host)
        message += ` For details, contact the course host, ${error.data.host.name}.`;
      return <div className="error">{message}</div>;
    }
    if (error.data?.error)
      return <div className="error">{error.data.error}</div>;
    if (typeof error === 'string') return <div className="error">{error}</div>;
  }

  let main = (
    <main>
      {course.authorized && (
        <div className="buttons">
          <NavButton onClick={showRoster}>View Roster</NavButton>
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
      <CourseEnrollButton course={course} setCourse={setCourse} />
      <div>Host: {course.host.name}</div>
      <CourseInstructors
        course={course}
        setCourse={setCourse}
        editable={true}
      />
      {course.authorized && (
        <CourseInvitedInstructors
          invitations={course.instruction_invitations}
        />
      )}
      <div>Status: {capitalize(course.status)}</div>
      <div>{course.description}</div>
      <CourseLessons course={course} setCourse={setCourse} />
      <CourseAssignments course={course} />
    </main>
  );
  if (rosterOn) main = <CourseRoster course={course} hide={hideRoster} />;

  return (
    <div>
      {<CourseStatusNotice status={course.status} />}
      <h1>{course.title}</h1>
      {editForm || main}
    </div>
  );
}

const Course = asResource(CourseBase, CourseForm, 'course', {
  formHeading: false,
  catchError: false,
});
export default Course;
