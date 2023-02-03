import { useContext } from 'react';
import MessageContext from './contexts/MessageContext';

export default function NavButton({ onClick, children }) {
  const setMessage = useContext(MessageContext).set;

  function handleClick() {
    setMessage(null);
    onClick();
  }
  return <button onClick={handleClick}>{children}</button>;
}
