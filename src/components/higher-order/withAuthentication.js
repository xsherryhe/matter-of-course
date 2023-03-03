import { useEffect, useContext } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import fetcher from '../../fetcher';

import MessageContext from '../contexts/MessageContext';
import UserContext from '../contexts/UserContext';

export default function withAuthentication(
  Component,
  { authenticatedPage = true } = {}
) {
  return function AuthenticatedComponent(props) {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');

    const { user, set: setUser } = useContext(UserContext);
    const setMessage = useContext(MessageContext).set;

    useEffect(() => {
      async function updateUser() {
        const response = await fetcher('current_user');
        if (response.status < 400) setUser(response.data);
      }
      updateUser();
    }, [setUser]);

    useEffect(() => {
      if (user || !authenticatedPage) return;

      setMessage(
        <div className="error">
          You need to sign in or sign up before continuing.
        </div>
      );
    }, [user, setMessage]);

    if (user || !authenticatedPage) return <Component {...props} />;
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
