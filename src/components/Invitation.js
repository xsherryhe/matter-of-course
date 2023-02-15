import { useState } from 'react';
import '../styles/Invitation.css';
import fetcher from '../fetcher';

export default function Invitation({
  invitation: {
    id,
    course: { title },
    sender: { username },
    response: invitationResponse,
  },
}) {
  const [message, setMessage] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setMessage(<span className="error">{data.error}</span>);
  }

  async function handleAccept() {
    const response = await fetcher(`instruction_invitations/${id}`, {
      method: 'PATCH',
      query: 'accept=true',
    });
    if (response.status < 400)
      setMessage(`You are now an instructor for ${title}!`);
    else handleErrors(response);
  }

  async function handleDecline() {
    const response = await fetcher(`instruction_invitations/${id}`, {
      method: 'DELETE',
    });
    if (response.status < 400) setMessage('Invitation has been declined.');
    else handleErrors(response);
  }

  if (message) return <div>{message}</div>;

  return (
    <div className="invitation">
      <div className={invitationResponse}>
        {username} invited you to instruct the course {title}.
      </div>
      <div className="buttons">
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
}
