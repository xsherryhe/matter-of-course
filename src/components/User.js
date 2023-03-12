import '../styles/User.css';

export default function User({ user }) {
  return (
    <span className="user">
      <img src={user.avatar_url} alt="" className="avatar" />
      {user.name}
    </span>
  );
}
