import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';

import UserAssignmentSubmissions from './UserAssignmentSubmissions';

export default function UserAllAssignmentSubmissions() {
  const stateTab = useLocation().state?.tab;
  const [submissions, setSubmissions] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getSubmissions() {
      const response = await fetcher('current_user', {
        query: 'with=all_assignment_submissions',
      });
      if (response.status < 400)
        setSubmissions(response.data.all_assignment_submissions);
      else handleErrors(response);
    }
    getSubmissions();
  }, []);

  return (
    <UserAssignmentSubmissions
      submissions={submissions}
      submissionsError={error}
      back={{
        location: 'My Assignments',
        route: '/my-assignments',
        state: {},
      }}
      tab={stateTab}
    />
  );
}
