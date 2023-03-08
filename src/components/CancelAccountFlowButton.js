import { useEffect, useState } from 'react';
import fetcher from '../fetcher';

import CancelAccountButton from './CancelAccountButton';
import withErrorHandling from './higher-order/withErrorHandling';
import NavLink from './NavLink';

function CancelAccountFlowButtonBase({ handleErrors }) {
  const [exclusiveAuthorizedCourses, setExclusiveAuthorizedCourses] =
    useState(null);

  useEffect(() => {
    async function getExclusiveAuthorizedCourses() {
      const response = await fetcher('current_user', {
        query: 'with=exclusive_authorized_courses',
      });
      if (response.status < 400)
        setExclusiveAuthorizedCourses(
          response.data.exclusive_authorized_courses
        );
      else handleErrors(response);
    }
    getExclusiveAuthorizedCourses();
  }, [handleErrors]);

  if (!exclusiveAuthorizedCourses) return <button>Loading...</button>;
  if (exclusiveAuthorizedCourses.length === 0) return <CancelAccountButton />;
  return (
    <NavLink to="/cancel-account" state={{ exclusiveAuthorizedCourses }}>
      <button>Cancel My Account</button>
    </NavLink>
  );
}

const CancelAccountFlowButton = withErrorHandling(CancelAccountFlowButtonBase, {
  routed: false,
});
export default CancelAccountFlowButton;
