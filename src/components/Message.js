import NavButton from './NavButton';

export default function Message({
  message: {
    subject,
    body,
    sender: { name: senderName },
    recipient: { name: recipientName },
  },
  hide,
}) {
  return (
    <div>
      <NavButton onClick={hide}>Back to Messages</NavButton>
      <div>From: {senderName}</div>
      <div>To: {recipientName}</div>
      <div>Subject: {subject}</div>
      <div>{body}</div>
      <div className="buttons">
        <button>Reply</button>
        <button>Delete</button>
      </div>
    </div>
  );
}
