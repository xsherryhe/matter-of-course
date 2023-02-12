import { useEffect, useState } from 'react';
import fetcher from '../fetcher';

import MessageForm from './MessageForm';
import NavButton from './NavButton';

export default function Messages() {
  const [type, setType] = useState('received');
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newOn, setNewOn] = useState(false);

  function showNew() {
    setNewOn(true);
  }

  function hideNew() {
    setNewOn(false);
  }

  function completeNew(data) {
    if (type === 'sent') setMessages((messages) => [data, ...messages]);
    hideNew();
  }

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getMessages() {
      setLoading(true);
      const response = await fetcher(`current_messages/${type}`);
      if (response.status < 400) setMessages(response.data);
      else handleErrors(response);
      setLoading(false);
    }
    getMessages();
  }, [type]);

  function tabInbox() {
    setType('received');
  }

  function tabOutbox() {
    setType('sent');
  }

  let main;
  if (error) main = <div className="error">{error}</div>;
  else if (loading) main = 'Loading...';
  else if (messages) {
    if (messages.length)
      main = messages.map(
        ({
          id,
          recipient: { name: recipientName },
          sender: { name: senderName },
          subject,
        }) => (
          <div key={id}>
            {type === 'received' && <div>From: {senderName}</div>}
            {type === 'sent' && <div>To: {recipientName}</div>}
            <div>{subject}</div>
          </div>
        )
      );
    else main = 'No messages yet!';
  }

  return (
    <div>
      <h1>My Messages</h1>
      {!newOn && <NavButton onClick={showNew}>New Message</NavButton>}
      {newOn && (
        <MessageForm
          heading={false}
          close={hideNew}
          completeAction={completeNew}
        />
      )}
      <div className="tabs">
        <button disabled={type === 'received'} onClick={tabInbox}>
          Inbox
        </button>
        <button disabled={type === 'sent'} onClick={tabOutbox}>
          Outbox
        </button>
      </div>
      {main}
    </div>
  );
}
