import { useContext } from 'react';
import '../styles/Header.css';
import UserContext from './contexts/UserContext';

export default function Header() {
  const user = useContext(UserContext).user;

  let userDisplay = (
    <div className="buttons">
      <button>Log In</button>
      <button>Sign Up</button>
    </div>
  );
  if (user) userDisplay = user.name;

  return (
    <header>
      <div className="logo">Matter of Course</div>
      <div>{userDisplay}</div>
    </header>
  );
}
