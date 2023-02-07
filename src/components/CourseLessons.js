import { useState } from 'react';
import { Link } from 'react-router-dom';

import CourseLessonsEdit from './CourseLessonsEdit';

export default function CourseLessons({ course, setCourse }) {
  const { id, lessons, authorized } = course;
  const [editOn, setEditOn] = useState(false);

  function showEdit() {
    setEditOn(true);
  }

  function hideEdit() {
    setEditOn(false);
  }

  function finishEdit(data) {
    setCourse(data);
    hideEdit();
  }

  if (!lessons.length) return 'No lessons yet!';

  let main = (
    <main>
      {authorized && <button onClick={showEdit}>Edit Lesson Structure</button>}
      {lessons.map(({ id: lessonId, title }) => (
        <div>
          <Link
            key={lessonId}
            to={`/course/${id}/lesson/${lessonId}`}
            state={{ course }}
          >
            {title}
          </Link>
        </div>
      ))}
    </main>
  );
  if (editOn)
    main = (
      <CourseLessonsEdit
        course={course}
        hideEdit={hideEdit}
        finishEdit={finishEdit}
      />
    );

  return (
    <div className="lessons">
      <h2>Lessons</h2>
      {main}
      {authorized && (
        <Link to="new-lesson" state={{ course }}>
          <button>Add a Lesson</button>
        </Link>
      )}
    </div>
  );
}