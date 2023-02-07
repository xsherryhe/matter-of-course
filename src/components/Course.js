import { capitalize } from '../utilities';

import CourseStatusNotice from './CourseStatusNotice';
import CourseForm from './CourseForm';
import asResource from './higher-order/asResource';
import CourseInstructors from './CourseInstructors';
import CourseInvitedInstructors from './CourseInvitedInstructors';
import LeaveInstructorButton from './LeaveInstructorButton';
import CourseLessons from './CourseLessons';

function CourseBase({
  resource: course,
  setResource: setCourse,
  error,
  setError,
  editForm,
  editButton,
  deleteButton,
}) {
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
          {editButton}
          {
            <LeaveInstructorButton
              course={course}
              setCourse={setCourse}
              setCourseError={setError}
            />
          }
          {deleteButton}
        </div>
      )}
      {course.host && <div>Host: {course.host.name}</div>}
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
    </main>
  );

  return (
    <div>
      {<CourseStatusNotice status={course.status} />}
      <h1>{course.title}</h1>
      {editForm || main}
      <CourseLessons course={course} setCourse={setCourse} />
    </div>
  );
}

const Course = asResource(CourseBase, CourseForm, 'course', {
  formHeading: false,
  catchError: false,
});
export default Course;
