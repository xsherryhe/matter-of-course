import { useState, useEffect } from 'react';
import fetcher from '../fetcher';
import { getUniqueBy } from '../utilities';

import MessageForm from './MessageForm';
import NavLink from './NavLink';

export default function Message({
  message: initialMessage,
  messageId,
  type,
  deleteButton,
}) {
  const [message, setMessage] = useState(initialMessage);
  const [parentOn, setParentOn] = useState(false);
  const [replyOn, setReplyOn] = useState(false);
  const [error, setError] = useState(null);

  const {
    id,
    read_status: readStatus,
    subject,
    body,
    role,
    parent_id: parentId,
    messageable_type,
    sender,
    recipient,
  } = message || {};

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    if (message) return;

    async function getMessage() {
      const response = await fetcher(`messages/${messageId}`);
      if (response.status < 400) setMessage(response.data);
      else handleErrors(response);
    }
    getMessage();
  }, [message, messageId]);

  useEffect(() => {
    if (!message) return;
    if (readStatus === 'read') return;

    async function updateToRead() {
      const response = await fetcher(`messages/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify({ message: { read_status: 'read' } }),
      });
      if (response.status < 400) setMessage(response.data);
      else handleErrors(response);
    }
    updateToRead();
  }, [message, readStatus, id]);

  function showParent() {
    setParentOn(true);
  }

  function hideParent() {
    setParentOn(false);
  }

  function showReply() {
    setReplyOn(true);
  }

  function hideReply() {
    setReplyOn(false);
  }

  if (error) return <div className="error">{error}</div>;
  if (!message) return 'Loading...';

  const parentMessage = (
    <div>
      {!parentOn && <button onClick={showParent}>View Previous Message</button>}
      {parentOn && (
        <div>
          <Message messageId={parentId} type="parent" />
          <button onClick={hideParent}>Hide</button>
        </div>
      )}
    </div>
  );

  let bodyDisplay = body;
  if (messageable_type) {
    const route = { InstructionInvitation: '/my-invitations' }[
      messageable_type
    ];
    if (route) bodyDisplay = <NavLink to={route}>{body}</NavLink>;
  }

  return (
    <div>
      {parentId && parentMessage}
      <div>Subject: {subject}</div>
      <div>From: {sender.name}</div>
      <div>To: {recipient.name}</div>
      <div>{bodyDisplay}</div>
      <div className="buttons">
        <button onClick={showReply} disabled={replyOn}>
          Reply
        </button>
        {type === 'inbox' && deleteButton}
      </div>
      {replyOn && (
        <MessageForm
          heading={false}
          defaultValues={{ subject: `Re: ${subject}`, parent_id: id }}
          completeAction={hideReply}
          close={hideReply}
          recipientOptions={getUniqueBy(
            [
              {
                name: `${sender.name} (${sender.username})`,
                value: sender.username,
                isDefault: type === 'inbox' || role === 'recipient',
              },
              {
                name: `${recipient.name} (${recipient.username})`,
                value: recipient.username,
                isDefault: type === 'outbox' || role === 'sender',
              },
            ],
            'value'
          )}
          submitText="Reply"
        />
      )}
    </div>
  );
}
