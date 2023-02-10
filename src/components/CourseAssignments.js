import NavLink from './NavLink';

export default function CourseAssignments({
  heading = true,
  course: { id: courseId, assignments, authorized },
}) {
  if (!authorized) return null;

  return (
    <div>
      {heading && <h2>Student Assignments</h2>}
      {assignments.map(({ id, title }) => (
        <div key={id}>
          <NavLink
            to={`/assignment/${id}/submissions`}
            state={{
              back: { name: 'Course', location: `/course/${courseId}` },
            }}
          >
            {title}
          </NavLink>
        </div>
      ))}
    </div>
  );
}
