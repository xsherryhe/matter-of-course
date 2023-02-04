import { capitalize } from '../utilities';

import CourseInstructors from './CourseInstructors';
import CourseStatusNotice from './CourseStatusNotice';
import CourseForm from './CourseForm';
import asResource from './higher-order/asResource';
import CourseInvitedInstructors from './CourseInvitedInstructors';

function CourseBase({ resource, error, editForm, editButton, deleteButton }) {
  console.log(resource);
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
      {resource.authorized && (
        <div className="buttons">
          {editButton}
          {deleteButton}
        </div>
      )}
      {resource.host && <div>Host: {resource.host.name}</div>}
      <CourseInstructors instructors={resource.instructors} />
      {resource.authorized && (
        <CourseInvitedInstructors
          invitations={resource.instruction_invitations}
        />
      )}
      <div>Status: {capitalize(resource.status)}</div>
      <div>{resource.description}</div>
    </main>
  );

  return (
    <div>
      {<CourseStatusNotice status={resource.status} />}
      <h1>{resource.title}</h1>
      {editForm || main}
      <div>
        <h2>Lessons</h2>
        {resource.lessons.length
          ? resource.lessons.map(({ title }) => title)
          : 'No lessons yet!'}
      </div>
      {resource.authorized && <button>Add a Lesson</button>}
    </div>
  );
}

const Course = asResource(CourseBase, CourseForm, 'course', {
  formHeading: false,
  catchError: false,
});
export default Course;
