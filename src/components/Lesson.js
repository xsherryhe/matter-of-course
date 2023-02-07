import { Link, useParams } from 'react-router-dom';
import asResource from './higher-order/asResource';
import LessonForm from './LessonForm';

function LessonBase({
  resource: lesson,
  error,
  editForm,
  editButton,
  deleteButton,
}) {
  const { courseId } = useParams();

  if (error) {
    let displayError = '';
    if (error.data?.error)
      displayError = <div className="error">{error.data.error}</div>;
    if (typeof error === 'string')
      displayError = <div className="error">{error}</div>;
    return (
      <div>
        <Link to={`/course/${courseId}`}>Back to Course</Link>
        {displayError}
      </div>
    );
  }

  let main = (
    <main>
      {lesson.authorized && (
        <div className="buttons">
          {editButton}
          {deleteButton}
        </div>
      )}
      {lesson.lesson_sections.map(({ id, title, body }) => (
        <div key={id} className="section">
          <h2>{title}</h2>
          <div>{body}</div>
        </div>
      ))}
    </main>
  );
  return (
    <div>
      <Link to={`/course/${courseId}`}>Back to Course</Link>
      <h1>{lesson.title}</h1>
      {editForm || main}
    </div>
  );
}

const Lesson = asResource(LessonBase, LessonForm, 'lesson', {
  formHeading: false,
  catchError: false,
});
export default Lesson;
