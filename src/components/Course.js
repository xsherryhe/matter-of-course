import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import CourseAssignments from './CourseAssignments';
import NavLink from './NavLink';
import NavButton from './NavButton';
import CourseMessageButton from './CourseMessageButton';

function CourseBase({
  resource: course,
  setResource: setCourse,
  error,
  setError,
  editForm,
  editButton,
  deleteButton,
}) {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const [rosterOn, setRosterOn] = useState(state?.rosterOn || false);

  function showRoster() {
    setRosterOn(true);
  }

  function hideRoster() {
    setRosterOn(false);
    navigate(pathname, { replace: true });
  }

  if (error) {
    if (error.status === 401) {
      const { status, host } = error.data;
      return (
        <div className="error">
          This course is {status}. For details, contact the course host,{' '}
          <NavLink
            to="/new-message"
            state={{
              recipientOptions: [
                {
                  name: `${host.name} (${host.username}) - Host`,
                  value: host.username,
                },
              ],
            }}
          >
            {host.name}
          </NavLink>
          .
        </div>
      );
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
      <CourseMessageButton course={course} />
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
