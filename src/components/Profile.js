import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import fetcher from '../fetcher';

import UserContext from './contexts/UserContext';
import withErrorHandling from './higher-order/withErrorHandling';
import NavLink from './NavLink';
import UserCourses from './UserCourses';

function ProfileBase({ handleErrors }) {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    async function getResource() {
      if (!id) return setProfileUser(user);

      const response = await fetcher(`users/${id}`);
      if (response.status < 400) setProfileUser(response.data);
      else handleErrors(response);
    }
    getResource();
  }, [id, user, handleErrors]);

  if (!profileUser) return 'Loading...';
  return (
    <div>
      <img src={profileUser.avatar_url} alt="" />
      <h1>{profileUser.name}</h1>
      {!id && (
        <NavLink to="/edit-profile">
          <button>Edit Profile and Registration</button>
        </NavLink>
      )}
      <h2>{profileUser.username}</h2>
      <h3>{profileUser.email}</h3>
      <div>
        <h2>{profileUser.name}'s Courses</h2>
        <UserCourses heading={false} />
      </div>
    </div>
  );
}

const Profile = withErrorHandling(ProfileBase);
export default Profile;
