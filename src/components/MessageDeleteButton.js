import fetcher from '../fetcher';

import withErrorHandling from './higher-order/withErrorHandling';
import NavButton from './NavButton';

function MessageDeleteButtonBase({ id, completeDelete, handleErrors }) {
  async function deleteMessage() {
    const response = await fetcher(`messages/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({ message: { read_status: 'deleted' } }),
    });
    if (response.status < 400) completeDelete();
    else handleErrors(response);
  }

  return <NavButton onClick={deleteMessage}>Delete</NavButton>;
}

const MessageDeleteButton = withErrorHandling(MessageDeleteButtonBase, {
  routed: false,
});
export default MessageDeleteButton;
