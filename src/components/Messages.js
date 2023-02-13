import { useCallback, useEffect, useState } from 'react';
import '../styles/Messages.css';
import fetcher from '../fetcher';

import MessageForm from './MessageForm';
import Message from './Message';
import NavButton from './NavButton';

export default function Messages() {
  const [type, setType] = useState('inbox');
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
    if (type === 'outbox') setMessages((messages) => [data, ...messages]);
    hideNew();
  }

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  const getMessages = useCallback(async () => {
    setLoading(true);
    const response = await fetcher(`current_messages/${type}`);
    if (response.status < 400) setMessages(response.data);
    else handleErrors(response);
    setLoading(false);
  }, [type]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  function showMessage(message) {
    return function () {
      setMessage(message);
    };
  }

  function hideMessage() {
    setMessage(null);
    getMessages();
  }

  function tabInbox() {
    setType('inbox');
  }

  function tabOutbox() {
    setType('outbox');
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
          <NavButton disabled={type === 'inbox'} onClick={tabInbox}>
            Inbox
          </NavButton>
          <NavButton disabled={type === 'outbox'} onClick={tabOutbox}>
            Outbox
          </NavButton>
        </div>
      </header>
    );

  let main;
  if (loading) main = 'Loading...';
  else if (error) main = <div className="error">{error}</div>;
  else if (message)
    main = (
      <main>
        <NavButton onClick={hideMessage}>Back to Messages</NavButton>
        <Message message={message} type={type} />
      </main>
    );
  else if (messages) {
    if (messages.length)
      main = (
        <main>
          {messages.map((message) => (
            <div
              className={`message-item ${
                type === 'inbox' ? message.read_status : ''
              }`}
              key={message.id}
            >
              <NavButton onClick={showMessage(message)}>
                {type === 'inbox' && <div>From: {message.sender.name}</div>}
                {type === 'outbox' && <div>To: {message.recipient.name}</div>}
                <div>{message.subject}</div>
              </NavButton>
            </div>
          ))}
        </main>
      );
    else main = 'No messages yet!';
  }

  return (
    <div className="messages">
      <h1>My Messages</h1>
      {header}
      {main}
    </div>
  );
}
