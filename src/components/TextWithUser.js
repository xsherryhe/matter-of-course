import '../styles/TextWithUser.css';

export default function TextWithUser({ user, text }) {
  return (
    <div className="text-with-user">
      <img src={user.avatar_url} alt="" className="text-avatar" />
      {text}
    </div>
  );
}
