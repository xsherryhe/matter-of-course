import '../styles/HeadingWithUser.css';

export default function HeadingWithUser({ user, text }) {
  return (
    <h2 className="heading-with-user">
      <img src={user.avatar_url} alt="" className="heading-avatar" />
      {text}
    </h2>
  );
}
