import { useContext } from 'react';
import '../styles/Header.css';

import UserContext from './contexts/UserContext';
import NavLink from './NavLink';
import LogInButton from './LogInButton';
import LogOutButton from './LogOutButton';
import SignUpButton from './SignUpButton';

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
        {user.name}
        <LogOutButton />
      </div>
    );

  return (
    <header>
      <NavLink to="/" className="logo">
        Matter of Course
      </NavLink>
      <div>{userDisplay}</div>
    </header>
  );
}
