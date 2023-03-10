import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';

import withErrorHandling from './higher-order/withErrorHandling';
import CancelAccountButton from './CancelAccountButton';
import CancelAccountHostedCourse from './CancelAccountHostedCourse';

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

  const noConflict = ['hosted', 'instructed'].every(
    (key) => conflictingCourses[key]?.length === 0
  );
  if (noConflict)
    return (
      <div>
        <h1>Cancel My Account</h1>
        <div>You can now cancel your account.</div>
        <CancelAccountButton />
      </div>
    );

  // TO DO: Conflicting instructed courses
  return (
    <div>
      <h1>Cancel My Account</h1>
      <div>
        Before you cancel your account, you must reassign your host/instructor
        role for the following courses.
        {initialConflictingCourses.hosted && (
          <div>
            <h2>Hosted Courses</h2>
            <div>
              Please change the host of these courses to a different instructor.
            </div>
            {initialConflictingCourses.hosted.map((course) => (
              <CancelAccountHostedCourse
                key={course.id}
                course={course}
                setConflictingCourses={setConflictingCourses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const CancelAccount = withErrorHandling(CancelAccountBase);
export default CancelAccount;
