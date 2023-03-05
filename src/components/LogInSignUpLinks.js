import { useLocation } from 'react-router-dom';

import NavLink from './NavLink';

export default function LogInSignUpLinks() {
  const { pathname } = useLocation();
  const firstLink = pathname.startsWith('/log-in')
    ? { route: '/sign-up', location: 'Sign up' }
    : { route: '/log-in', location: 'Log in' };

  return (
    <div>
      <NavLink to={firstLink.route}>{firstLink.location}</NavLink>
      <NavLink to="/forgot-password">Forgot your password?</NavLink>
    </div>
  );
}
