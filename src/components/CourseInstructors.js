import { useState } from 'react';
import '../styles/CourseInstructors.css';

import ResourceForm from './ResourceForm';
import { instructorLoginsField } from './CourseForm';
import DeleteButton from './DeleteButton';

export default function CourseInstructors({
  course: { id, instructors: initialInstructors, hosted, authorized },
  setCourse,
}) {
  const [instructors] = useState(initialInstructors);
  const [invited, setInvited] = useState(false);
  const [removed, setRemoved] = useState([]);

  function completeInvite(data) {
    setCourse(data);
    setInvited(true);
    setTimeout(() => setInvited(false), 2000);
  }

  function completeRemove(instructorId) {
    return function () {
      setRemoved((removed) => [...removed, instructorId]);
      setCourse((course) => {
        const instructors = course.instructors;
        const instructorIndex = instructors.findIndex(
          ({ id }) => id === instructorId
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
        {instructors.map(({ id: instructorId, name }) => {
          const instructorRemoved = removed.includes(instructorId);
          return (
            <li key={instructorId}>
              {!instructorRemoved && (
                <span>
                  {name}
                  {hosted && (
                    <DeleteButton
                      route={`courses/${id}/instructors/${instructorId}`}
                      resource="instructor"
                      id={instructorId}
                      buttonText="Remove"
                      action="remove"
                      completeAction={completeRemove(instructorId)}
                    />
                  )}
                </span>
              )}
              {instructorRemoved && 'Instructor has been removed.'}
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
