import { useContext } from 'react';
import MessageContext from './contexts/MessageContext';

export default function NavButton({ onClick, disabled, children, ...props }) {
  const setMessage = useContext(MessageContext).set;

  function handleClick(e) {
    e.preventDefault();
    setMessage(null);
    onClick(e);
  }
  return (
    <button disabled={disabled} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
