import NavLink from './NavLink';

export default function Home() {
  return (
    <div className="home">
      <h1>Matter of Course</h1>
      <h2>Find a course that matters to you</h2>
      <NavLink to="/courses">
        <button>Browse Courses</button>
      </NavLink>
    </div>
  );
}
