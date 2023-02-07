import { useState, useContext } from 'react';

import PopUpContext from './contexts/PopUpContext';
import PopUp from './PopUp';
import NavButton from './NavButton';
import MessageContext from './contexts/MessageContext';
import fetcher from '../fetcher';

export default function CourseStatusConfirmPopUp({
  course: { id, lessons },
  setCourse,
  newStatus,
}) {
  const newStatusText = ['Pending', 'Open', 'Closed'][newStatus];
  const [loading, setLoading] = useState(false);

  const setPopUp = useContext(PopUpContext).set;
  const setMessage = useContext(MessageContext).set;

  function validate() {
    if (newStatus === 1 && !lessons.length) {
      setMessage(
        <span className="error">
          You must have at least one lesson before opening a course.
        </span>
      );
      return false;
    }
    return true;
  }

  function handleErrors(data) {
    const error = data.error || data.base?.[0];
    if (error) setMessage(<span className="error">{error}</span>);
  }

  function completeStatusChange(data) {
    setMessage(`This course is now ${newStatusText}.`);
    setCourse(data);
  }

  async function handleYes() {
    if (!validate()) return setPopUp(null);

    setLoading(true);
    const response = await fetcher(`courses/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({ course: { status: newStatus } }),
    });
    const data = await response.json();
    if (response.status < 400) completeStatusChange(data);
    else handleErrors(data);
    setLoading(false);
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
