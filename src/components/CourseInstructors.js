import { useState } from 'react';
import '../styles/CourseInstructors.css';

import DeleteButton from './DeleteButton';
import CourseInviteInstructorsForm from './CourseInviteInstructorsForm';

export default function CourseInstructors({
  course: { id, instructors: initialInstructors, hosted, authorized },
  setCourse,
}) {
  const [instructors] = useState(initialInstructors);
  const [removed, setRemoved] = useState([]);

  function completeRemove(instructorId) {
    return function () {
      setRemoved((removed) => [...removed, instructorId]);
      setCourse((course) => ({
        ...course,
        instructors: course.instructors.filter(({ id }) => id !== instructorId),
      }));
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
      <CourseInviteInstructorsForm courseId={id} setCourse={setCourse} />
    </div>
  );
}
