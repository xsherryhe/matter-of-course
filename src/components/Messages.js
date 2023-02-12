import { useEffect, useState } from 'react';
import fetcher from '../fetcher';

import MessageForm from './MessageForm';
import Message from './Message';
import NavButton from './NavButton';

export default function Messages() {
  const [type, setType] = useState('received');
  const [message, setMessage] = useState(null);
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

  function showMessage(message) {
    return function () {
      setMessage(message);
    };
  }

  function hideMessage() {
    setMessage(null);
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

  let header;
  if (!message)
    header = (
      <header>
        {!newOn && <NavButton onClick={showNew}>New Message</NavButton>}
        {newOn && (
          <MessageForm
            heading={false}
            close={hideNew}
            completeAction={completeNew}
          />
        )}
        <div className="tabs">
          <NavButton disabled={type === 'received'} onClick={tabInbox}>
            Inbox
          </NavButton>
          <NavButton disabled={type === 'sent'} onClick={tabOutbox}>
            Outbox
          </NavButton>
        </div>
      </header>
    );

  let main;
  if (error) main = <div className="error">{error}</div>;
  else if (loading) main = 'Loading...';
  else if (message) main = <Message message={message} hide={hideMessage} />;
  else if (messages) {
    if (messages.length)
      main = messages.map((message) => (
        <div key={message.id}>
          <NavButton onClick={showMessage(message)}>
            {type === 'received' && <div>From: {message.sender.name}</div>}
            {type === 'sent' && <div>To: {message.recipient.name}</div>}
            <div>{message.subject}</div>
          </NavButton>
        </div>
      ));
    else main = 'No messages yet!';
  }

  return (
    <div>
      <h1>My Messages</h1>
      {header}
      {main}
    </div>
  );
}
