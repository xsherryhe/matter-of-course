export default function LogIn() {
  return (
    <form>
      <h1>Log in</h1>
      <div className="field">
        <label htmlFor="user_login">Username or email</label>
        <input type="text" name="user[login]" id="user_login" />
      </div>
      <div className="field">
        <label htmlFor="user_password">Password</label>
        <input type="password" name="user[password]" id="user_password" />
      </div>
      <div className="field">
        <input type="checkbox" name="user[remember_me]" id="user_remember_me" />
        <label htmlFor="user_remember_me">Remember Me</label>
      </div>
      <button type="submit">Log in</button>
    </form>
    // Sign up link
    // Forgot password link
    // Confirmation instructions link
  );
}
