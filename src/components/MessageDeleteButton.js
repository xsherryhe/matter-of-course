import { useState } from 'react';
import fetcher from '../fetcher';

import NavButton from './NavButton';

export default function MessageDeleteButton({ id, completeDelete }) {
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  async function deleteMessage() {
    const response = await fetcher(`messages/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({ message: { read_status: 'deleted' } }),
    });
    if (response.status < 400) completeDelete();
    else handleErrors(response);
  }

  if (error) return <span className="error">{error}</span>;

  return <NavButton onClick={deleteMessage}>Delete</NavButton>;
}
