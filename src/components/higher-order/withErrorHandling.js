import { useContext, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import MessageContext from '../contexts/MessageContext';
import BackLink from '../BackLink';

export default function withErrorHandling(
  ComponentBase,
  { routed = true, catchErrors = true, redirect } = {}
) {
  return function Component(props) {
    const back = useLocation().state?.back;
    const { route: redirectRoute, state: redirectState } = back ||
      redirect || { route: '/' };
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const setMessage = useContext(MessageContext).set;

    const handleErrors = useCallback(
      ({ status, data }) => {
        if (status === 401 && data.error && routed && catchErrors) {
          setMessage(<div className="error">{data.error}</div>);
          return navigate(redirectRoute, { state: redirectState });
        } else if (data.error) setError({ status, message: data.error });
      },
      [redirectRoute, redirectState, setMessage, navigate]
    );

    if (error?.message && catchErrors)
      return (
        <div>
          <div className="error">{error.message}</div>
          {routed && back && <BackLink back={back} />}
        </div>
      );

    return (
      <ComponentBase handleErrors={handleErrors} error={error} {...props} />
    );
  };
}
