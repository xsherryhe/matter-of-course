import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <h1>Matter of Course</h1>
      <h2>Find a course that matters to you</h2>
      <Link to="courses">
        <button>Browse Courses</button>
      </Link>
    </div>
  );
}
