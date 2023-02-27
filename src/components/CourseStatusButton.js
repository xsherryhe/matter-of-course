import { useContext, useState } from 'react';
import fetcher from '../fetcher';

import PopUpContext from './contexts/PopUpContext';
import MessageContext from './contexts/MessageContext';
import CourseStatusConfirmPopUp from './CourseStatusConfirmPopUp';

export default function CourseStatusButton({ course, setCourse }) {
  const { id, lessons, status } = course;
  const [buttonText, newStatus] = {
    pending: ['Open Course', 1],
    open: ['Close Course', 2],
    closed: ['Re-open Course', 1],
  }[status];
  const newStatusText = ['Pending', 'Open', 'Closed'][newStatus];
  const [loading, setLoading] = useState(false);

  const setPopUp = useContext(PopUpContext).set;
  const setMessage = useContext(MessageContext).set;

  function validate() {
    if (newStatus === 1 && !lessons.length) {
      setMessage(
        <div className="error">
          You must have at least one lesson before opening a course.
        </div>
      );
      return false;
    }
    return true;
  }

  function handleErrors({ data }) {
    const error = data.error || data.base?.[0];
    if (error) setMessage(<div className="error">{error}</div>);
  }

  function completeStatusChange(data) {
    setMessage(`This course is now ${newStatusText}.`);
    setCourse(data);
  }

  async function changeStatus() {
    if (!validate()) return setPopUp(null);

    setLoading(true);
    const response = await fetcher(`courses/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({ course: { status: newStatus } }),
    });
    if (response.status < 400) completeStatusChange(response.data);
    else handleErrors(response);
    setLoading(false);
  }

  function handleClick() {
    setPopUp(
      <CourseStatusConfirmPopUp
        newStatusText={newStatusText}
        changeStatus={changeStatus}
        loading={loading}
      />
    );
  }

  return <button onClick={handleClick}>{buttonText}</button>;
}
