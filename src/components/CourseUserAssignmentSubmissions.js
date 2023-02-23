import { useLocation } from 'react-router-dom';
import UserAssignmentSubmissions from './UserAssignmentSubmissions';

export default function CourseUserAssignmentSubmissions({
  course: { id },
  submissions,
  submissionsError,
  incompleteSubmissionsPage,
  incompleteSubmissionsPagination,
  completeSubmissionsPage,
  completeSubmissionsPagination,
}) {
  const stateTab = useLocation().state?.assignmentTab;

  return (
    <div>
      <h2>My Assignments</h2>
      <UserAssignmentSubmissions
        heading={false}
        submissions={submissions}
        submissionsError={submissionsError}
        incompleteSubmissionsPagination={incompleteSubmissionsPagination}
        completeSubmissionsPagination={completeSubmissionsPagination}
        back={{
          location: 'Course',
          route: `/course/${id}`,
          state: {
            tab: 'assignments',
            incompleteSubmissionsPage,
            completeSubmissionsPage,
          },
        }}
        tab={stateTab}
      />
    </div>
  );
}
