import { useContext } from 'react';
import '../styles/PopUp.css';

import PopUpContext from './contexts/PopUpContext';

export default function PopUp({ children }) {
  const setPopUp = useContext(PopUpContext).set;

  function handleClose() {
    setPopUp(null);
  }

  return (
    <div className="pop-up">
      <div className="container">
        <button onClick={handleClose} className="close">
          X
        </button>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
