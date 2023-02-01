import { useLocation, useSearchParams } from 'react-router-dom';

import NavLink from './NavLink';
export default function SignUpButton() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');

  return (
    <NavLink
      to={`sign-up?from=${from || location.pathname.slice(1) || 'home'}`}
    >
      <button>Sign Up</button>
    </NavLink>
  );
}
