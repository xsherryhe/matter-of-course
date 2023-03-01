import { useParams } from 'react-router-dom';

import asResource from './higher-order/asResource';
import ProfileForm from './ProfileForm';
import UserCourses from './UserCourses';

function ProfileBase({
  resource: { name, username, email },
  editForm,
  editButton,
}) {
  const { id } = useParams();
  if (editForm) return editForm;
  return (
    <div>
      <h1>{name}</h1>
      {!id && editButton}
      <h2>{username}</h2>
      <div>Email: {email}</div>
      <div>
        <h2>{name}'s Courses</h2>
        <UserCourses heading={false} />
      </div>
    </div>
  );
}

const Profile = asResource(ProfileBase, ProfileForm, 'user', {
  route: (id) => (id ? `users/${id}` : 'current_user'),
});
export default Profile;
