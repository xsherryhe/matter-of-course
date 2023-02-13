import { useState, useEffect } from 'react';
import fetcher from '../fetcher';
import { getUniqueBy } from '../utilities';

import MessageForm from './MessageForm';

export default function Message({ message: initialMessage, messageId, type }) {
  const [message, setMessage] = useState(initialMessage);
  const [parentOn, setParentOn] = useState(false);
  const [replyOn, setReplyOn] = useState(false);
  const [error, setError] = useState(null);

  const { id, read_status, subject, body, role, parent_id, sender, recipient } =
    message || {};

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
    if (read_status === 'read') return;

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
  }, [message, read_status, id]);

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
          <Message messageId={parent_id} type="parent" />
          <button onClick={hideParent}>Hide</button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {parent_id && parentMessage}
      <div>Subject: {subject}</div>
      <div>From: {sender.name}</div>
      <div>To: {recipient.name}</div>
      <div>{body}</div>
      <div className="buttons">
        <button onClick={showReply} disabled={replyOn}>
          Reply
        </button>
        {type === 'inbox' && <button>Delete</button>}
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
