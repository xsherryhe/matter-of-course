import { useState } from 'react';
import '../styles/Invitation.css';
import fetcher from '../fetcher';
import withErrorHandling from './higher-order/withErrorHandling';

function InvitationBase({
  invitation: {
    id,
    course: { title },
    sender: { username },
    response: invitationResponse,
  },
  handleErrors,
}) {
  const [message, setMessage] = useState(null);

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

const Invitation = withErrorHandling(InvitationBase, { routed: false });
export default Invitation;
