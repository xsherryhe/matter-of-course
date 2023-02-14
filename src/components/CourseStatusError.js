import NavLink from './NavLink';

export default function CourseStatusError({ error: { status, host } }) {
  return (
    <div className="error">
      This course is {status}. For details, contact the course host,{' '}
      <NavLink
        to="/new-message"
        state={{
          recipientOptions: [
            {
              name: `${host.name} (${host.username}) - Host`,
              value: host.username,
            },
          ],
        }}
      >
        {host.name}
      </NavLink>
      .
    </div>
  );
}
