import NavLink from './NavLink';

export default function CoursePostsButton({ course }) {
  const { id, authorized, enrolled } = course;
  if (!(authorized || enrolled)) return null;

  return (
    <NavLink to={`/course/${id}/discussion`} state={{ postable: course }}>
      <button>View Discussion</button>
    </NavLink>
  );
}
