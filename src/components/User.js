import '../styles/User.css';

export default function User({ user, labelAttribute = 'name' }) {
  return (
    <span className="user">
      <img src={user.avatar_url} alt="" className="avatar" />
      {user[labelAttribute]}
    </span>
  );
}
