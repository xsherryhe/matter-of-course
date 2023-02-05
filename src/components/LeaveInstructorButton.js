import { useState, useContext } from 'react';
import MessageContext from './contexts/MessageContext';

import UserContext from './contexts/UserContext';
import DeleteButton from './DeleteButton';

export default function LeaveInstructorButton({
  course,
  setCourse,
  setCourseError,
}) {
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const setMessage = useContext(MessageContext).set;

  function completeLeave() {
    const message = 'You are no longer an instructor for this course.';
    if (course.status === 'open' || course.host.id === user.id) {
      setMessage(message);
      setCourse((course) => ({
        ...course,
        instructors: course.instructors.filter(({ id }) => id !== user.id),
      }));
    } else setCourseError(message);
  }

  async function handleErrors(response) {
    const data = await response.json();
    if (data.error) setError(data.error);
  }

  if (!course.instructors.some(({ id }) => id === user.id)) return null;

  return (
    <span>
      <DeleteButton
        route={`courses/${course.id}/instructors/${user.id}`}
        resource="instructor"
        id={user.id}
        buttonText="Leave Instructor Role"
        confirmText="Are you sure you wish to stop being an instructor for this course?"
        completeAction={completeLeave}
        handleErrors={handleErrors}
      />
      {error && <div className="error">{error}</div>}
    </span>
  );
}
