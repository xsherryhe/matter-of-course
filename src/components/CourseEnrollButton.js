import { useState } from 'react';
import fetcher from '../fetcher';

export default function CourseEnrollButton({
  course: { id, authorized, enrolled },
  setCourse,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function validate() {
    if (enrolled) {
      setMessage(<span className="error">You are already enrolled!</span>);
      return false;
    }
    return true;
  }

  async function handleErrors(response) {
    const data = await response.json();
    if (data.student?.includes('is not unique'))
      setMessage(<span className="error">You are already enrolled!</span>);
    else if (data.error) setError(data.error);
  }

  function completeEnroll() {
    setMessage('Successfully enrolled!');
    setCourse((course) => ({ ...course, enrolled: true }));
  }

  async function enroll() {
    if (!validate()) return;

    setLoading(true);
    const response = await fetcher(`courses/${id}/enrollments`, {
      method: 'POST',
    });
    if (response.status < 400) completeEnroll();
    else handleErrors(response);
    setLoading(false);
  }

  if (message) return <div>{message}</div>;
  if (authorized || enrolled) return null;

  return (
    <div>
      <button onClick={enroll} disabled={loading}>
        Enroll in Course
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
