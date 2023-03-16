import List from './List';
import User from './User';

export default function CourseInvitedInstructors({ invitations }) {
  if (!invitations.length) return null;

  return (
    <div className="invited-instructors">
      Invited Instructors:{' '}
      <List
        items={(invitations || []).map(({ recipient }) => (
          <User key={recipient.id} user={recipient} labelAttribute="username" />
        ))}
      />
    </div>
  );
}
