import { useContext } from 'react';
import { Link } from 'react-router-dom';
import fetcher from '../fetcher';

import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';

export default function NavLink({
  authenticationMessage = false,
  children,
  ...props
}) {
  const setMessage = useContext(MessageContext).set;
  const { user, set: setUser } = useContext(UserContext);

  const newMessage =
    authenticationMessage && !user ? (
      <div className="error">
        You need to sign in or sign up before continuing.
      </div>
    ) : null;

  function resetMessage() {
    setMessage(newMessage);
  }

  async function updateUser() {
    const response = await fetcher('current_user');
    if (response.status < 400) setUser(response.data);
  }

  function handleClick() {
    resetMessage();
    updateUser();
  }

  return (
    <Link onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
