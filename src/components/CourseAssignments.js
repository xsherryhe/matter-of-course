import NavLink from './NavLink';

export default function CourseAssignments({
  heading = true,
  course: { id: courseId, assignments, authorized },
}) {
  if (!authorized) return null;
  if (!assignments.length) return null;

  return (
    <div>
      {heading && <h2>Student Assignments</h2>}
      {assignments.map(({ id, title }) => (
        <div key={id}>
          <NavLink
            to={`/assignment/${id}/submissions`}
            state={{
              back: {
                location: 'Course',
                route: `/course/${courseId}`,
                state: { tab: 'assignments' },
              },
            }}
          >
            {title}
          </NavLink>
        </div>
      ))}
    </div>
  );
}
