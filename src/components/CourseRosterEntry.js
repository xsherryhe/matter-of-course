import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/CourseRosterEntry.css';

import NavLink from './NavLink';
import DeleteButton from './DeleteButton';
import withPagination from './higher-order/withPagination';
import CourseRosterEntryAssignmentSubmissions from './CourseRosterEntryAssignmentSubmissions';

function CourseRosterEntryBase({
  courseId,
  student: { id: studentId, name, username },
  rosterPage,
  submissionsPage,
  updateSubmissionsPage,
  submissionsPagination,
}) {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const submissionsOnId = state?.submissionsOn;
  const [submissionsOn, setSubmissionsOn] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (submissionsOnId === studentId) {
      setSubmissionsOn(true);
      navigate(pathname, { replace: true });
    }
  }, [submissionsOnId, studentId, navigate, pathname]);

  function toggleSubmissions() {
    setSubmissionsOn((submissionsOn) => !submissionsOn);
  }

  function completeRemove() {
    setRemoved(true);
  }

  if (removed)
    return (
      <tr className="entry">
        <td className="removed">Student has been removed from course.</td>
      </tr>
    );

  return (
    <tr className="entry">
      <td>{name}</td>
      <td>{username}</td>
      <td>
        <NavLink
          to="/new-message"
          state={{
            recipientOptions: [
              {
                name: `${name} (${username})`,
                value: username,
              },
            ],
            back: {
              location: 'Roster',
              route: `/course/${courseId}`,
              state: {
                tab: 'roster',
                rosterPage,
                submissionsOn: false,
                submissionsPage,
              },
            },
          }}
        >
          <button>Message</button>
        </NavLink>
      </td>
      <td>
        <button onClick={toggleSubmissions}>
          {submissionsOn ? 'Hide' : 'View'} Assignment Submissions
        </button>
      </td>
      <td>
        <DeleteButton
          resource="enrollment"
          id={studentId}
          route={`courses/${courseId}/enrollments/${studentId}`}
          action="remove"
          completeAction={completeRemove}
          buttonText="Remove Student"
          confirmText="Are you sure you wish to remove this student?"
        />
      </td>
      {submissionsOn && (
        <td className="submissions">
          <CourseRosterEntryAssignmentSubmissions
            courseId={courseId}
            studentId={studentId}
            rosterPage={rosterPage}
            submissionsPage={submissionsPage}
            updateSubmissionsPage={updateSubmissionsPage}
            submissionsPagination={submissionsPagination}
          />
        </td>
      )}
    </tr>
  );
}

const CourseRosterEntry = withPagination(CourseRosterEntryBase, 'submissions');
export default CourseRosterEntry;
