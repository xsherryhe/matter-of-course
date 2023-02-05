import { useState } from 'react';
import '../styles/CourseInstructors.css';
import fetcher from '../fetcher';
import { list } from '../utilities';

import ResourceForm from './ResourceForm';
import { instructorLoginsField } from './CourseForm';

export default function CourseInstructors({
  course: { id, instructors, hosted, authorized },
  edit = false,
}) {
  const [loading, setLoading] = useState(false);
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

  async function handleErrors(response, instructorId) {
    const data = await response.json();
    if (data.error)
      setErrors((errors) => ({ ...errors, [instructorId]: data.error }));
  }

  function completeInvite(data) {
    edit.invitations(data.instruction_invitations);
    setMessages((messages) => ({ ...messages, invite: 'Invited!' }));
    setTimeout(
      () => setMessages((messages) => ({ ...messages, invite: null })),
      2000
    );
  }

  function completeRemove(instructorId) {
    setMessages((messages) => ({
      ...messages,
      [instructorId]: 'Instructor has been removed.',
    }));
    setRemoved((removed) => [...removed, instructorId]);
  }

  function handleRemove(instructorId) {
    return async function () {
      setLoading(true);
      const response = await fetcher(
        `courses/${id}/instructors/${instructorId}`,
        { method: 'DELETE' }
      );
      if (response.status < 400) completeRemove(instructorId);
      else handleErrors(response, instructorId);
      setLoading(false);
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
          {instructors.map(({ id, name }) => (
            <li key={id}>
              {messages[id] || (
                <span>
                  {name}
                  {hosted && (
                    <button disabled={loading} onClick={handleRemove(id)}>
                      Remove
                    </button>
                  )}
                  {errors[id] && <div className="error">{errors[id]}</div>}
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
      Instructors:{' '}
      {list(
        instructors
          .filter(({ id }) => !removed.includes(id))
          .map(({ name }) => name)
      )}
      {authorized && edit && <button onClick={showEdit}>Edit</button>}
    </div>
  );
}
