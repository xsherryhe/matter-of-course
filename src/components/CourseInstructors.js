import { useState } from 'react';
import '../styles/CourseInstructors.css';

import ResourceForm from './ResourceForm';
import { instructorLoginsField } from './CourseForm';
import DeleteButton from './DeleteButton';

export default function CourseInstructors({
  course: { id, instructors, hosted, authorized },
  setCourse,
}) {
  const [invited, setInvited] = useState(false);
  const [removed, setRemoved] = useState([]);
  const [errors, setErrors] = useState({});

  function handleErrors(instructorId) {
    return function ({ data }) {
      if (data.error)
        setErrors((errors) => ({ ...errors, [instructorId]: data.error }));
    };
  }

  function completeInvite(data) {
    setCourse(data);
    setInvited(true);
    setTimeout(() => setInvited(false), 2000);
  }

  function completeRemove(instructor) {
    return function () {
      setRemoved((removed) => [...removed, instructor]);

      setCourse((course) => {
        const instructors = course.instructors;
        const instructorIndex = instructors.findIndex(
          ({ id }) => id === instructor.id
        );
        return {
          ...course,
          instructors: [
            ...instructors.slice(0, instructorIndex),
            ...instructors.slice(instructorIndex + 1),
          ],
        };
      });
    };
  }

  if (!authorized) return null;

  return (
    <div className="course-instructors">
      <h2>Instructors</h2>
      <ul>
        {instructors
          .concat(removed)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((instructor) => {
            const instructorRemoved = removed.includes(instructor);
            return (
              <li key={instructor.id}>
                {instructorRemoved && 'Instructor has been removed.'}
                {!instructorRemoved && (
                  <span>
                    {instructor.name}
                    {hosted && (
                      <DeleteButton
                        route={`courses/${id}/instructors/${instructor.id}`}
                        resource="instructor"
                        id={instructor.id}
                        buttonText="Remove"
                        action="remove"
                        completeAction={completeRemove(instructor)}
                        handleErrors={handleErrors(instructor.id)}
                      />
                    )}
                    {errors[instructor.id] && (
                      <div className="error">{errors[instructor.id]}</div>
                    )}
                  </span>
                )}
              </li>
            );
          })}
      </ul>
      <ResourceForm
        heading={false}
        flash={false}
        resource="course"
        fields={[instructorLoginsField]}
        action="update"
        id={id}
        completeAction={completeInvite}
        submitText="Invite"
      />
      {invited && 'Invited!'}
    </div>
  );
}
