import NavLink from './NavLink';
import asResource from './higher-order/asResource';
import LessonForm from './LessonForm';
import LessonAssignments from './LessonAssignments';

function LessonBase({
  resource: lesson,
  error,
  editForm,
  editButton,
  deleteButton,
}) {
  const {
    id,
    title,
    course_id: courseId,
    authorized,
    lesson_sections,
  } = lesson;

  if (error) {
    let displayError = '';
    if (error.data?.error)
      displayError = <div className="error">{error.data.error}</div>;
    if (typeof error === 'string')
      displayError = <div className="error">{error}</div>;
    return (
      <div>
        <NavLink to={`/course/${courseId}`}>Back to Course</NavLink>
        {displayError}
      </div>
    );
  }

  let main = (
    <main>
      {authorized && (
        <div className="buttons">
          {editButton}
          {deleteButton}
        </div>
      )}
      {lesson_sections.map(({ id, title, body }) => (
        <div key={id} className="section">
          <h2>{title}</h2>
          <div>{body}</div>
        </div>
      ))}
      <LessonAssignments lesson={lesson} />
      <NavLink to={`/lesson/${id}/discussion`} state={{ postable: lesson }}>
        <button>View Discussion</button>
      </NavLink>
    </main>
  );

  return (
    <div>
      <NavLink to={`/course/${courseId}`}>Back to Course</NavLink>
      <h1>{title}</h1>
      {editForm || main}
    </div>
  );
}

const Lesson = asResource(LessonBase, LessonForm, 'lesson', {
  formHeading: false,
  catchError: false,
});
export default Lesson;
