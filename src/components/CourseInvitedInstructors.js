import { list } from '../utilities';

export default function CourseInvitedInstructors({ invitations }) {
  if (!invitations.length) return null;

  return (
    <div>
      Invited Instructors:{' '}
      {list((invitations || []).map(({ recipient: { username } }) => username))}
    </div>
  );
}
