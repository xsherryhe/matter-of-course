import { useState } from 'react';

import NavButton from './NavButton';
import NavLink from './NavLink';
import DeleteButton from './DeleteButton';

export default function CourseAssignments({
  course: { id: courseId, authorized },
  assignments,
  assignmentsError,
  assignmentsPage,
  assignmentsPagination,
  tabToLessons,
}) {
  const [deleted, setDeleted] = useState([]);
  const [errors, setErrors] = useState({});

  function completeDelete(assignmentId) {
    return function () {
      setDeleted((deleted) => [...deleted, assignmentId]);
    };
  }

  function handleErrors(id) {
    return function ({ data }) {
      if (data.error) setErrors((errors) => ({ ...errors, [id]: data.error }));
    };
  }

  if (!authorized) return null;

  let main = 'Loading...';
  if (assignmentsError) main = <div className="error">{assignmentsError}</div>;
  else if (assignments) {
    if (assignments.length)
      main = (
        <div>
          {assignments.map(({ id, title }) => {
            const assignmentDeleted = deleted.includes(id);
            return (
              <div key={id}>
                {!assignmentDeleted && (
                  <div>
                    <NavLink
                      to={`/assignment/${id}/submissions`}
                      state={{
                        back: {
                          location: 'Course',
                          route: `/course/${courseId}`,
                          state: { tab: 'assignments', assignmentsPage },
                        },
                      }}
                    >
                      {title}
                    </NavLink>
                    <DeleteButton
                      resource="assignment"
                      id={id}
                      buttonText="Delete"
                      completeAction={completeDelete(id)}
                      handleErrors={handleErrors(id)}
                    />
                  </div>
                )}
                {assignmentDeleted && 'Assignment has been deleted.'}
                {errors[id] && <div className="error">{errors[id]}</div>}
              </div>
            );
          })}
          {assignmentsPagination}
        </div>
      );
    else
      main = (
        <div>
          No assignments yet! Create assignments by{' '}
          <NavButton onClick={tabToLessons}>adding them into lessons</NavButton>
          .
        </div>
      );
  }

  return (
    <div>
      <h2>Assignments</h2>
      {main}
    </div>
  );
}
