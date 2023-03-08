import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';

import withErrorHandling from './higher-order/withErrorHandling';
import CancelAccountButton from './CancelAccountButton';

function CancelAccountBase({ handleErrors }) {
  const initialConflictingCourses =
    useLocation().state?.exclusiveAuthorizedCourses;
  const [conflictingCourses, setConflictingCourses] = useState(
    initialConflictingCourses || null
  );

  useEffect(() => {
    if (initialConflictingCourses) return;

    async function getConflictingCourses() {
      const response = await fetcher('current_user', {
        query: 'with=exclusive_authorized_courses',
      });
      if (response.status < 400)
        setConflictingCourses(response.data.exclusive_authorized_courses);
      else handleErrors(response);
    }
    getConflictingCourses();
  }, [initialConflictingCourses, handleErrors]);

  if (conflictingCourses === null) return 'Loading...';
  if (conflictingCourses.length === 0)
    return (
      <div>
        <h1>Cancel My Account</h1>
        <div>You can now cancel your account.</div>
        <CancelAccountButton />
      </div>
    );

  return (
    <div>
      <h1>Cancel My Account</h1>
      <div>
        Before you cancel your account, you must reassign your host/instructor
        role for the following courses:
      </div>
    </div>
  );
}

const CancelAccount = withErrorHandling(CancelAccountBase);
export default CancelAccount;
