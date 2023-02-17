import { useContext } from 'react';

import UserContext from './contexts/UserContext';
import NavLink from './NavLink';
import UserCourses from './UserCourses';

export default function Home() {
  const { user } = useContext(UserContext);

  let main = (
    <NavLink to="/courses">
      <button>Browse Courses</button>
    </NavLink>
  );

  if (user) main = <UserCourses heading={false} />;

  return (
    <div className="home">
      <h1>Matter of Course</h1>
      <h2>Find a course that matters to you</h2>
      {main}
    </div>
  );
}
