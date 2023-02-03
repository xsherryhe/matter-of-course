import { useContext } from 'react';
import MessageContext from './contexts/MessageContext';

export default function NavButton({ onClick, disabled, children }) {
  const setMessage = useContext(MessageContext).set;

  function handleClick() {
    setMessage(null);
    onClick();
  }
  return (
    <button disabled={disabled} onClick={handleClick}>
      {children}
    </button>
  );
}
