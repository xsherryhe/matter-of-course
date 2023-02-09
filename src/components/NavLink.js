import { useContext } from 'react';
import { Link } from 'react-router-dom';

import MessageContext from './contexts/MessageContext';

export default function NavLink({ children, ...props }) {
  const setMessage = useContext(MessageContext).set;

  function clearMessage() {
    setMessage(null);
  }

  return (
    <Link onClick={clearMessage} {...props}>
      {children}
    </Link>
  );
}
