import NavButton from './NavButton';
import NavLink from './NavLink';

export default function CourseAssignments({
  course: { id: courseId, assignments, authorized },
  tabToLessons,
}) {
  if (!authorized) return null;

  let main = (
    <div>
      No assignments yet! Create assignments by{' '}
      <NavButton onClick={tabToLessons}>adding them into lessons</NavButton>.
    </div>
  );
  if (assignments.length)
    main = assignments.map(({ id, title }) => (
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
    ));

  return (
    <div>
      <h2>Assignments</h2>
      {main}
    </div>
  );
}
