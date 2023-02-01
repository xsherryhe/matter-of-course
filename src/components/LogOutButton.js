import { useContext, useState } from 'react';
import fetcher from '../fetcher';

import MessageContext from './contexts/MessageContext';
import UserContext from './contexts/UserContext';

export default function LogOutButton() {
  const [loading, setLoading] = useState(false);
  const setMessage = useContext(MessageContext).set;
  const setUser = useContext(UserContext).set;

  async function handleClick() {
    setLoading(true);
    await fetcher('users/sign_out', { method: 'DELETE' });
    setMessage('Successfully logged out.');
    setUser(false);
    setLoading(false);
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  );
}
