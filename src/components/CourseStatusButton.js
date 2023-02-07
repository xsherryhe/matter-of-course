import { useContext } from 'react';
import PopUpContext from './contexts/PopUpContext';
import CourseStatusConfirmPopUp from './CourseStatusConfirmPopUp';

export default function CourseStatusButton({ course, setCourse }) {
  const setPopUp = useContext(PopUpContext).set;
  const [buttonText, newStatus] = {
    pending: ['Open Course', 1],
    open: ['Close Course', 2],
    closed: ['Re-open Course', 1],
  }[course.status];

  function handleClick() {
    setPopUp(
      <CourseStatusConfirmPopUp
        course={course}
        setCourse={setCourse}
        newStatus={newStatus}
      />
    );
  }

  return <button onClick={handleClick}>{buttonText}</button>;
}
