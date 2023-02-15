import { useContext } from 'react';

import PopUpContext from './contexts/PopUpContext';
import NavButton from './NavButton';
import PopUp from './PopUp';

export default function DeleteConfirmPopUp({
  resource,
  action,
  confirmText,
  handleDelete,
  loading,
}) {
  const setPopUp = useContext(PopUpContext).set;

  async function handleYes() {
    handleDelete();
    setPopUp(null);
  }

  function handleNo() {
    setPopUp(null);
  }

  return (
    <PopUp>
      <div>
        {confirmText || `Are you sure you wish to ${action} this ${resource}?`}
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
