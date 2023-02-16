import { useEffect, useState } from 'react';
import fetcher from '../fetcher';
import Invitation from './Invitation';

export default function Invitations() {
  const [invitations, setInvitations] = useState(null);

  useEffect(() => {
    async function getInvitations() {
      const response = await fetcher('instruction_invitations');
      setInvitations(response.data);
    }

    async function updateInvitations() {
      await fetcher('instruction_invitations', {
        method: 'PATCH',
        query: 'read=true',
      });
    }

    getInvitations();
    return updateInvitations;
  }, []);

  if (!invitations) return 'Loading...';

  let main = 'No invitations yet!';
  if (invitations.length)
    main = invitations.map((invitation) => (
      <Invitation key={invitation.id} invitation={invitation} />
    ));

  return (
    <div>
      <h1>My Invitations</h1>
      <main>{main}</main>
    </div>
  );
}
