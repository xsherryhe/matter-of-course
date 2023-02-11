import { useParams } from 'react-router-dom';

import NavLink from './NavLink';
import asResource from './higher-order/asResource';
import LessonForm from './LessonForm';
import Assignment from './Assignment';

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
        <NavLink to={`/course/${courseId}`}>Back to Course</NavLink>
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
      <h2>Assignments</h2>
      {lesson.assignments.map((assignment) => (
        <Assignment
          key={assignment.id}
          assignment={assignment}
          parentIds={{ course: courseId, lesson: lesson.id }}
          authorized={lesson.authorized}
        />
      ))}
    </main>
  );

  return (
    <div>
      <NavLink to={`/course/${courseId}`}>Back to Course</NavLink>
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
