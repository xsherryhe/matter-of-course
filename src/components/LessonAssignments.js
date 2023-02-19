import Assignment from './Assignment';

export default function LessonAssignments({
  lesson: { id, course_id: courseId, authorized, assignments },
  tab,
}) {
  if (!assignments.length) return null;

  return (
    <div>
      <h2>Assignments</h2>
      {assignments.map((assignment) => (
        <Assignment
          key={assignment.id}
          assignment={assignment}
          authorized={authorized}
          back={{
            location: 'Lesson',
            route: `/course/${courseId}/lesson/${id}`,
            state: { tab, expanded: assignment.id },
          }}
        />
      ))}
    </div>
  );
}
