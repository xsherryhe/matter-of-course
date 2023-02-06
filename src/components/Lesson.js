import asResource from './higher-order/asResource';
import LessonForm from './LessonForm';

function LessonBase({
  resource: lesson,
  setResource: setLesson,
  editForm,
  editButton,
  deleteButton,
}) {
  let main = (
    <main>
      {editButton}
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
      <h1>{lesson.title}</h1>
      {editForm || main}
    </div>
  );
}

const Lesson = asResource(LessonBase, LessonForm, 'lesson', {
  formHeading: false,
});
export default Lesson;
