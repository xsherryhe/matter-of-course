import { useState } from 'react';
import '../styles/CourseInstructors.css';
import { list } from '../utilities';

import ResourceForm from './ResourceForm';
import { instructorLoginsField } from './CourseForm';
import DeleteButton from './DeleteButton';

export default function CourseInstructors({
  course: { id, instructors, hosted, authorized },
  setCourse,
  editable = false,
}) {
  const [editOn, setEditOn] = useState(false);
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [removed, setRemoved] = useState([]);

  function showEdit() {
    setEditOn(true);
  }

  function hideEdit() {
    setEditOn(false);
  }

  function handleErrors(instructorId) {
    return function ({ data }) {
      if (data.error)
        setErrors((errors) => ({ ...errors, [instructorId]: data.error }));
    };
  }

  function completeInvite(data) {
    setCourse(data);
    setMessages((messages) => ({ ...messages, invite: 'Invited!' }));
    setTimeout(
      () => setMessages((messages) => ({ ...messages, invite: null })),
      2000
    );
  }

  function completeRemove(instructorId) {
    return function () {
      setMessages((messages) => ({
        ...messages,
        [instructorId]: 'Instructor has been removed.',
      }));
      setRemoved((removed) => [...removed, instructorId]);
    };
  }

  if (editOn)
    return (
      <div className="instructors-edit">
        <button className="close" onClick={hideEdit}>
          X
        </button>
        <h2>Instructors</h2>
        <ul>
          {instructors.map(({ id: instructorId, name }) => (
            <li key={instructorId}>
              {messages[instructorId] || (
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
                      handleErrors={handleErrors(instructorId)}
                    />
                  )}
                  {errors[instructorId] && (
                    <div className="error">{errors[instructorId]}</div>
                  )}
                </span>
              )}
            </li>
          ))}
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
        {messages.invite}
      </div>
    );

  return (
    <div className="instructors">
      <h3>Instructors:</h3>{' '}
      {list(
        instructors
          .filter(({ id }) => !removed.includes(id))
          .map(({ name }) => name)
      )}
      {authorized && editable && <button onClick={showEdit}>Edit</button>}
    </div>
  );
}
