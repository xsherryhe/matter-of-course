import { useState, useEffect } from 'react';
import fetcher from '../fetcher';

import NavLink from './NavLink';
import withErrorHandling from './higher-order/withErrorHandling';

function CourseRosterEntryAssignmentSubmissionsBase({
  courseId,
  studentId,
  rosterPage,
  submissionsPage,
  updateSubmissionsPage,
  submissionsPagination,
  handleErrors,
}) {
  const [submissions, setSubmissions] = useState(null);

  useEffect(() => {
    async function getSubmissions() {
      const response = await fetcher(
        `courses/${courseId}/assignment_submissions`,
        { query: `student_id=${studentId}&page=${submissionsPage}` }
      );
      if (response.status < 400) {
        setSubmissions(response.data.submissions);
        updateSubmissionsPage(response.data);
      } else handleErrors(response);
    }
    getSubmissions();
  }, [
    courseId,
    studentId,
    submissionsPage,
    updateSubmissionsPage,
    handleErrors,
  ]);

  if (!submissions) return 'Loading...';
  if (!submissions.length)
    return 'This student has not submitted any assignments.';

  return (
    <div>
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Assignment</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(
            ({
              id,
              completion_date: completionDate,
              assignment: { title },
            }) => (
              <tr key={id}>
                <td>{completionDate}</td>
                <td>
                  <NavLink
                    to={`/assignment/${id}`}
                    state={{
                      back: {
                        location: 'Roster',
                        route: `/course/${courseId}`,
                        state: {
                          tab: 'roster',
                          rosterPage,
                          submissionsOn: studentId,
                          submissionsPage,
                        },
                      },
                    }}
                  >
                    {title}
                  </NavLink>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {submissionsPagination}
    </div>
  );
}

const CourseRosterEntryAssignmentSubmissions = withErrorHandling(
  CourseRosterEntryAssignmentSubmissionsBase,
  { routed: false }
);
export default CourseRosterEntryAssignmentSubmissions;
