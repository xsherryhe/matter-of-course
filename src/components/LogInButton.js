import { useLocation, useSearchParams } from 'react-router-dom';

import NavLink from './NavLink';

export default function LogInButton() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');

  return (
    <NavLink
      to={`/log-in?from=${
        from || location.pathname.slice(1).replace(/\//g, '_') || 'home'
      }`}
      state={location.state}
    >
      <button>Log In</button>
    </NavLink>
  );
}
