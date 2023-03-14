import { useState } from 'react';
import '../styles/CourseInstructors.css';

import DeleteButton from './DeleteButton';
import CourseInviteInstructorsForm from './CourseInviteInstructorsForm';
import User from './User';

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
        {instructors.map((instructor) => {
          const instructorRemoved = removed.includes(instructor.id);
          return (
            <li key={instructor.id}>
              {!instructorRemoved && (
                <span>
                  <User user={instructor} />
                  {hosted && (
                    <DeleteButton
                      route={`courses/${id}/instructors/${instructor.id}`}
                      resource="instructor"
                      id={instructor.id}
                      buttonText="Remove"
                      action="remove"
                      completeAction={completeRemove(instructor.id)}
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
