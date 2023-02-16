import { getUniqueBy } from '../utilities';
import NavLink from './NavLink';

export default function CourseMessageButton({
  course: { id, host, instructors, enrolled, authorized },
}) {
  const recipientOptions = [
    { name: `${host.name} (${host.username}) - Host`, value: host.username },
  ];
  if (enrolled || authorized)
    recipientOptions.push(
      ...instructors.map(({ name, username }) => ({
        name: `${name} (${username}) - Instructor`,
        value: username,
      }))
    );

  return (
    <NavLink
      to="/new-message"
      state={{
        recipientOptions: getUniqueBy(recipientOptions, 'value'),
        back: { route: `/course/${id}`, location: 'Course' },
      }}
    >
      <button>Message {enrolled || authorized ? 'Instructors' : 'Host'}</button>
    </NavLink>
  );
}
