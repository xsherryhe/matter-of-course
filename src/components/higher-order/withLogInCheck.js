import { useContext } from 'react';
import fetcher from '../../fetcher';

import UserContext from '../contexts/UserContext';

export default function withLogInCheck(ComponentBase) {
  return function Component(props) {
    const setUser = useContext(UserContext).set;

    async function loggedIn() {
      const response = await fetcher('current_user');
      if (response.data) setUser(response.data);
      return Boolean(response.data);
    }

    return <ComponentBase loggedIn={loggedIn} {...props} />;
  };
}
