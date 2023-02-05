import { useContext, useState } from 'react';
import fetcher from '../fetcher';

import PopUpContext from './contexts/PopUpContext';
import NavButton from './NavButton';
import PopUp from './PopUp';

export default function DeleteConfirmPopUp({
  route,
  resource,
  id,
  action,
  confirmText,
  completeAction,
  handleErrors,
}) {
  const [loading, setLoading] = useState(false);
  const setPopUp = useContext(PopUpContext).set;

  async function handleYes() {
    setLoading(true);
    const response = await fetcher(route || `${resource}s/${id}`, {
      method: 'DELETE',
    });
    if (response.status < 400) completeAction();
    else if (handleErrors) handleErrors(response);
    setLoading(false);
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
