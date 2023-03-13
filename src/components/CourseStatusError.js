import '../styles/CourseStatusError.css';

import NavLink from './NavLink';
import User from './User';

export default function CourseStatusError({ error: { status, host } }) {
  return (
    <div className="error course-status-error">
      This course is {status}. For details, contact the course host:{' '}
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
        <User user={host} />
      </NavLink>
      .
    </div>
  );
}
