import { useContext } from 'react';

import PopUpContext from './contexts/PopUpContext';
import PopUp from './PopUp';
import NavButton from './NavButton';

export default function CourseStatusConfirmPopUp({
  newStatusText,
  changeStatus,
  loading,
}) {
  const setPopUp = useContext(PopUpContext).set;

  async function handleYes() {
    changeStatus();
    setPopUp(null);
  }

  function handleNo() {
    setPopUp(null);
  }

  return (
    <PopUp>
      <div>
        Are you sure you wish to change this course's status to {newStatusText}?
      </div>
      <div className="buttons">
        <NavButton disabled={loading} onClick={handleYes}>
          Yes
        </NavButton>
        <button disabled={loading} onClick={handleNo}>
          No
        </button>
      </div>
    </PopUp>
  );
}
