import { useState } from 'react';

import NavButton from './NavButton';
import NavLink from './NavLink';
import DeleteButton from './DeleteButton';

export default function CourseAssignments({
  course: { id: courseId, assignments: initialAssignments, authorized },
  setCourse,
  tabToLessons,
}) {
  const [assignments] = useState(initialAssignments);
  const [deleted, setDeleted] = useState([]);
  const [errors, setErrors] = useState({});

  function completeDelete(assignmentId) {
    return function () {
      setDeleted((deleted) => [...deleted, assignmentId]);
      setCourse((course) => {
        const assignments = course.assignments;
        const assignmentIndex = assignments.findIndex(
          ({ id }) => id === assignmentId
        );
        return {
          ...course,
          assignments: [
            ...assignments.slice(0, assignmentIndex),
            ...assignments.slice(assignmentIndex + 1),
          ],
        };
      });
    };
  }

  function handleErrors(id) {
    return function ({ data }) {
      if (data.error) setErrors((errors) => ({ ...errors, [id]: data.error }));
    };
  }

  if (!authorized) return null;

  let main = (
    <div>
      No assignments yet! Create assignments by{' '}
      <NavButton onClick={tabToLessons}>adding them into lessons</NavButton>.
    </div>
  );
  if (assignments.length)
    main = assignments.map(({ id, title }) => {
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
                    state: { tab: 'assignments' },
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
    });

  return (
    <div>
      <h2>Assignments</h2>
      {main}
    </div>
  );
}
