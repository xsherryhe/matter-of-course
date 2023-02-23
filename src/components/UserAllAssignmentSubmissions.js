import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';
import withPagination from './higher-order/withPagination';

import UserAssignmentSubmissions from './UserAssignmentSubmissions';

function UserAllAssignmentSubmissionsBase({
  incompleteSubmissionsPage,
  updateIncompleteSubmissionsPage,
  incompleteSubmissionsPagination,
  completeSubmissionsPage,
  updateCompleteSubmissionsPage,
  completeSubmissionsPagination,
}) {
  const stateTab = useLocation().state?.tab;
  const [submissions, setSubmissions] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getSubmissions() {
      const response = await fetcher('current_user', {
        query: `with=all_assignment_submissions&page=${incompleteSubmissionsPage},${completeSubmissionsPage}`,
      });
      if (response.status < 400) {
        setSubmissions(response.data.all_assignment_submissions);
        updateIncompleteSubmissionsPage(
          response.data.all_assignment_submissions.incomplete
        );
        updateCompleteSubmissionsPage(
          response.data.all_assignment_submissions.complete
        );
      } else handleErrors(response);
    }
    getSubmissions();
  }, [
    incompleteSubmissionsPage,
    updateIncompleteSubmissionsPage,
    completeSubmissionsPage,
    updateCompleteSubmissionsPage,
  ]);

  return (
    <UserAssignmentSubmissions
      submissions={submissions}
      submissionsError={error}
      incompleteSubmissionsPagination={incompleteSubmissionsPagination}
      completeSubmissionsPagination={completeSubmissionsPagination}
      back={{
        location: 'My Assignments',
        route: '/my-assignments',
        state: { incompleteSubmissionsPage, completeSubmissionsPage },
      }}
      tab={stateTab}
    />
  );
}

const UserAllAssignmentSubmissions = [
  'incompleteSubmissions',
  'completeSubmissions',
].reduce(
  (Component, resourceName) => withPagination(Component, resourceName),
  UserAllAssignmentSubmissionsBase
);
export default UserAllAssignmentSubmissions;
