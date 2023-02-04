import { list } from '../utilities';

export default function CourseInvitedInstructors({ invitations }) {
  return (
    <div>
      Invited Instructors:{' '}
      {list((invitations || []).map(({ recipient: { username } }) => username))}
    </div>
  );
}
