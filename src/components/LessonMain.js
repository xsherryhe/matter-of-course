import LessonAssignments from './LessonAssignments';

export default function LessonMain({
  lesson,
  editForm,
  editButton,
  deleteButton,
}) {
  if (editForm) return editForm;

  const { authorized, lesson_sections } = lesson;

  return (
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
    </main>
  );
}
