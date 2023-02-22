import { useEffect, useState } from 'react';
import fetcher from '../fetcher';
import withPagination from './higher-order/withPagination';
import Invitation from './Invitation';

function InvitationsBase({
  invitationsPage,
  updateInvitationsPage,
  invitationsPagination,
}) {
  const [invitations, setInvitations] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getInvitations() {
      const response = await fetcher('instruction_invitations', {
        query: `page=${invitationsPage}`,
      });
      if (response.status < 400) {
        setInvitations(response.data.invitations);
        updateInvitationsPage(response.data);
      } else handleErrors(response);
    }

    async function updateInvitations() {
      await fetcher('instruction_invitations', {
        method: 'PATCH',
        query: `read=true&page=${invitationsPage}`,
      });
    }

    getInvitations();
    return updateInvitations;
  }, [invitationsPage, updateInvitationsPage]);

  let main = 'Loading...';
  if (error) main = <div className="error">{error}</div>;
  else if (invitations) {
    if (invitations.length)
      main = (
        <div>
          {invitations.map((invitation) => (
            <Invitation key={invitation.id} invitation={invitation} />
          ))}
          {invitationsPagination}
        </div>
      );
    else main = 'No invitations yet!';
  }

  return (
    <div>
      <h1>My Invitations</h1>
      <main>{main}</main>
    </div>
  );
}

const Invitations = withPagination(InvitationsBase, 'invitations');
export default Invitations;
