import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';
import withErrorHandling from './higher-order/withErrorHandling';
import withPagination from './higher-order/withPagination';

import UserAssignmentSubmissions from './UserAssignmentSubmissions';

function UserAllAssignmentSubmissionsBase({
  incompleteSubmissionsPage,
  updateIncompleteSubmissionsPage,
  incompleteSubmissionsPagination,
  completeSubmissionsPage,
  updateCompleteSubmissionsPage,
  completeSubmissionsPagination,
  error,
  handleErrors,
}) {
  const stateTab = useLocation().state?.tab;
  const [submissions, setSubmissions] = useState(null);

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
    handleErrors,
  ]);

  return (
    <div>
      <h1>My Assignments</h1>
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
    </div>
  );
}

const PaginatedUserAllAssignmentSubmissions = [
  'incompleteSubmissions',
  'completeSubmissions',
].reduce(
  (Component, resourceName) => withPagination(Component, resourceName),
  UserAllAssignmentSubmissionsBase
);

const UserAllAssignmentSubmissions = withErrorHandling(
  PaginatedUserAllAssignmentSubmissions,
  { catchError: false }
);
export default UserAllAssignmentSubmissions;
