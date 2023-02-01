import { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

import UserContext from './contexts/UserContext';

export default function Header() {
  const user = useContext(UserContext).user;

  let userDisplay = (
    <div className="buttons">
      <Link to="log-in">
        <button>Log In</button>
      </Link>
      <Link to="sign-up">
        <button>Sign Up</button>
      </Link>
    </div>
  );
  if (user) userDisplay = user.name;

  return (
    <header>
      <Link to="/" className="logo">
        Matter of Course
      </Link>
      <div>{userDisplay}</div>
    </header>
  );
}
