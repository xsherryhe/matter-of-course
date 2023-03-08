import { useContext } from 'react';

import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';
import DeleteButton from './DeleteButton';

export default function LeaveInstructorButton({ course, setCourse }) {
  const { user } = useContext(UserContext);
  const setMessage = useContext(MessageContext).set;

  function completeLeave() {
    setMessage('You are no longer an instructor for this course.');
    setCourse((course) => ({
      ...course,
      instructors: course.instructors.filter(({ id }) => id !== user.id),
      authorized: course.hosted,
    }));
  }

  if (!course.instructors.some(({ id }) => id === user.id)) return null;

  return (
    <DeleteButton
      route={`courses/${course.id}/instructors/${user.id}`}
      resource="instructor"
      id={user.id}
      buttonText="Leave Instructor Role"
      confirmText="Are you sure you wish to stop being an instructor for this course?"
      completeAction={completeLeave}
    />
  );
}
