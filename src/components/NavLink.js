import { useContext } from 'react';
import { Link } from 'react-router-dom';

import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';

export default function NavLink({
  authenticationMessage = false,
  children,
  ...props
}) {
  const setMessage = useContext(MessageContext).set;
  const { user } = useContext(UserContext);

  const newMessage =
    authenticationMessage && !user ? (
      <span className="error">
        You need to sign in or sign up before continuing.
      </span>
    ) : null;

  function resetMessage() {
    setMessage(newMessage);
  }

  return (
    <Link onClick={resetMessage} {...props}>
      {children}
    </Link>
  );
}
