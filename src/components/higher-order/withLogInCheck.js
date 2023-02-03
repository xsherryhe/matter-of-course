import { useContext } from 'react';
import fetcher from '../../fetcher';

import UserContext from '../contexts/UserContext';

export default function withLogInCheck(ComponentBase) {
  return function Component(props) {
    const setUser = useContext(UserContext).set;

    async function loggedIn() {
      const response = await fetcher('current_user');
      const data = await response.json();
      if (data) setUser(data);
      return Boolean(data);
    }

    return <ComponentBase loggedIn={loggedIn} {...props} />;
  };
}
