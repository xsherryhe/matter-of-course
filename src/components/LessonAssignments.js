import Assignment from './Assignment';

export default function LessonAssignments({
  lesson: { id, course_id: courseId, authorized, assignments },
}) {
  if (!assignments.length) return null;

  return (
    <div>
      <h2>Assignments</h2>
      {assignments.map((assignment) => (
        <Assignment
          key={assignment.id}
          assignment={assignment}
          parentIds={{ course: courseId, lesson: id }}
          authorized={authorized}
        />
      ))}
    </div>
  );
}
