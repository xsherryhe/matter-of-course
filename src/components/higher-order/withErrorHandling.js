import { useContext, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import MessageContext from '../contexts/MessageContext';
import BackLink from '../BackLink';
import { capitalize } from '../../utilities';

export default function withErrorHandling(
  ComponentBase,
  {
    resourceName,
    routed = true,
    catchError = true,
    redirect = { route: '/', location: 'Home' },
  } = {}
) {
  return function Component(props) {
    const back = useLocation().state?.back;
    const { route: redirectRoute, state: redirectState } = back || redirect;
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const setMessage = useContext(MessageContext).set;

    const redirectUnauthorized = useCallback(
      (message) => {
        setMessage(<div className="error">{message}</div>);
        navigate(redirectRoute, { state: redirectState });
      },
      [redirectRoute, redirectState, setMessage, navigate]
    );

    const handleErrors = useCallback(
      ({ status, data }) => {
        if (status === 401 && data.error && routed && catchError)
          return redirectUnauthorized(data.error);
        else setError({ status, message: data.error });
      },
      [redirectUnauthorized]
    );

    if (error?.message && catchError)
      return (
        <div>
          <div className="error">{error.message}</div>
          {routed && <BackLink back={redirect} />}
        </div>
      );

    return (
      <ComponentBase
        {...{
          [`handle${resourceName ? capitalize(resourceName) : ''}Errors`]:
            handleErrors,
          [resourceName ? `${resourceName}Error` : 'error']: error,
        }}
        redirectUnauthorized={redirectUnauthorized}
        {...props}
      />
    );
  };
}
