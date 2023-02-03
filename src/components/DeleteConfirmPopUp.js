import { useContext, useState } from 'react';
import fetcher from '../fetcher';

import PopUpContext from './contexts/PopUpContext';
import NavButton from './NavButton';
import PopUp from './PopUp';

export default function DeleteConfirmPopUp({ resource, id, completeAction }) {
  const [loading, setLoading] = useState(false);
  const setPopUp = useContext(PopUpContext).set;

  function completeDelete(data) {
    completeAction(data.message);
    setPopUp(null);
  }

  async function handleYes() {
    setLoading(true);
    const response = await fetcher(`${resource}s/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (response.status < 400) completeDelete(data);
    setLoading(false);
  }

  function handleNo() {
    setPopUp(null);
  }

  return (
    <PopUp>
      <div>Are you sure you wish to delete this {resource}?</div>
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
