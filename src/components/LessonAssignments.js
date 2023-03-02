import { useState } from 'react';

import Assignment from './Assignment';
import LessonForm, { assignmentsFields } from './LessonForm';
import NavButton from './NavButton';

export default function LessonAssignments({
  lesson,
  setLesson,
  editable,
  tab,
}) {
  const {
    id,
    course_id: courseId,
    authorized,
    assignments: initialAssignments,
  } = lesson;
  const [assignments, setAssignments] = useState(initialAssignments);
  const [editOn, setEditOn] = useState(false);

  function showEdit() {
    setEditOn(true);
  }

  function hideEdit() {
    setEditOn(false);
  }

  function finishEdit(data) {
    setLesson(data);
    setAssignments(data.assignments);
    setEditOn(false);
  }

  function handleDelete(deleteId) {
    return function () {
      setLesson((lesson) => {
        const assignments = lesson.assignments;
        const deleteIndex = assignments.findIndex(({ id }) => id === deleteId);
        return {
          ...lesson,
          assignments: [
            ...assignments.slice(0, deleteIndex),
            ...assignments.slice(deleteIndex + 1),
          ],
        };
      });
    };
  }

  let main;
  if (editOn)
    main = (
      <LessonForm
        heading={false}
        fields={[
          {
            nested: {
              ...assignmentsFields.nested,
              heading: false,
              initialInstanceCount: 1,
            },
          },
        ]}
        defaultValues={lesson}
        id={id}
        action="update"
        back={false}
        close={hideEdit}
        completeAction={finishEdit}
        submitText="Update Assignments"
        flash={() => 'Successfully updated assignments.'}
      />
    );
  else {
    if (assignments.length)
      main = (
        <main>
          {assignments.map((assignment) => (
            <Assignment
              key={assignment.id}
              assignment={assignment}
              handleDelete={handleDelete(assignment.id)}
              authorized={authorized}
              back={{
                location: 'Lesson',
                route: `/course/${courseId}/lesson/${id}`,
                state: { tab, expanded: assignment.id },
              }}
            />
          ))}
        </main>
      );
    else main = <div>No assignments here!</div>;
  }

  return (
    <div>
      <h2>Assignments</h2>
      {authorized && editable && !editOn && (
        <NavButton onClick={showEdit}>
          {assignments.length ? 'Edit' : 'Add Assignment'}
        </NavButton>
      )}
      {main}
    </div>
  );
}
