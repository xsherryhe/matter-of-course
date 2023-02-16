import { useEffect } from 'react';
import { useContext } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';

import MessageContext from '../contexts/MessageContext';
import UserContext from '../contexts/UserContext';

export default function withAuthentication(Component) {
  return function AuthenticatedComponent(props) {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');

    const { user } = useContext(UserContext);
    const setMessage = useContext(MessageContext).set;

    useEffect(() => {
      if (user) return;

      setMessage(
        <span className="error">
          You need to sign in or sign up before continuing.
        </span>
      );
    }, [user, setMessage]);

    if (user) return <Component {...props} />;
    return (
      <Navigate
        to={`/log-in?from=${
          from || location.pathname.slice(1).replace(/\//g, '_') || 'home'
        }`}
        state={location.state}
      />
    );
  };
}
