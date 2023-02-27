import { useContext, useState } from 'react';
import fetcher from '../fetcher';
import UserContext from './contexts/UserContext';
import NavLink from './NavLink';

export default function CourseEnrollButton({
  course: { id, authorized, enrolled },
  setCourse,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { user } = useContext(UserContext);

  function handleErrors({ data }) {
    let error;
    if (data.student?.includes('is not unique'))
      error = 'You are already enrolled!';
    if (data.student?.includes('is a host or instructor for the course'))
      error = 'You are already an instructor or a host for this course.';
    else if (data.error === 'This enrollment no longer exists.')
      error = 'You are not enrolled yet.';
    else if (data.error) error = data.error;

    setMessage(<span className="error">{error}</span>);
  }

  function validate() {
    if (!user) {
      setMessage(<span className="error">Please sign in first.</span>);
      return false;
    }
    return true;
  }

  function validateEnroll() {
    if (!validate()) return false;
    if (enrolled) {
      setMessage(<span className="error">You are already enrolled!</span>);
      return false;
    }
    if (authorized) {
      setMessage(
        <span className="error">
          You are already an instructor or a host for this course.
        </span>
      );
      return false;
    }
    return true;
  }

  function completeEnroll() {
    setMessage('Successfully enrolled!');
    setCourse((course) => ({ ...course, enrolled: true }));
  }

  async function enroll() {
    if (!validateEnroll()) return;

    setLoading(true);
    const response = await fetcher(`courses/${id}/enrollments`, {
      method: 'POST',
    });
    if (response.status < 400) completeEnroll();
    else handleErrors(response);
    setLoading(false);
  }

  function validateUnenroll() {
    if (!validate()) return false;
    if (!enrolled) {
      setMessage(<span className="error">You are not enrolled yet.</span>);
      return false;
    }
    return true;
  }

  function completeUnenroll() {
    setMessage('Successfully unenrolled!');
    setCourse((course) => ({ ...course, enrolled: false }));
  }

  async function unenroll() {
    if (!validateUnenroll()) return;

    setLoading(true);
    const response = await fetcher(`courses/${id}/enrollments/${user.id}`, {
      method: 'DELETE',
    });
    if (response.status < 400) completeUnenroll();
    else handleErrors(response);
    setLoading(false);
  }

  if (!user)
    return (
      <NavLink authenticationMessage={true} to={`/log-in?from=course_${id}`}>
        <button>Enroll in Course</button>
      </NavLink>
    );

  if (authorized) return null;

  return (
    <div>
      <button onClick={enrolled ? unenroll : enroll} disabled={loading}>
        {enrolled ? 'Unenroll from' : 'Enroll in'} Course
      </button>
      {message && <div>{message}</div>}
    </div>
  );
}
