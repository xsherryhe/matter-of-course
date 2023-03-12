import { useContext } from 'react';
import '../styles/Header.css';

import UserContext from './contexts/UserContext';
import NavLink from './NavLink';
import LogInButton from './LogInButton';
import LogOutButton from './LogOutButton';
import SignUpButton from './SignUpButton';
import User from './User';

export default function Header() {
  const user = useContext(UserContext).user;

  let userDisplay = (
    <div className="display">
      <LogInButton />
      <SignUpButton />
    </div>
  );
  if (user)
    userDisplay = (
      <div className="display">
        <NavLink to="/courses">
          <button>Browse Courses</button>
        </NavLink>
        <NavLink to="/new-course">
          <button>New Course</button>
        </NavLink>
        <NavLink to="/my-courses">
          <button>My Courses</button>
        </NavLink>
        <NavLink to="/me">
          <button>My Profile</button>
        </NavLink>
        <NavLink to="/my-invitations">
          <button>My Invitations</button>
        </NavLink>
        <NavLink to="/my-assignments">
          <button>My Assignments</button>
        </NavLink>
        <NavLink to="/my-messages">
          <button>My Messages</button>
        </NavLink>
        <User user={user} />
        <LogOutButton />
      </div>
    );

  return (
    <header className="site-header">
      <NavLink to="/" className="logo">
        Matter of Course
      </NavLink>
      {userDisplay}
    </header>
  );
}
