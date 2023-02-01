import { useContext } from 'react';
import { Link } from 'react-router-dom';

import MessageContext from './contexts/MessageContext';

export default function NavLink({ to, className, children }) {
  const setMessage = useContext(MessageContext).set;

  function clearMessage() {
    setMessage(null);
  }

  return (
    <Link to={to} className={className} onClick={clearMessage}>
      {children}
    </Link>
  );
}
