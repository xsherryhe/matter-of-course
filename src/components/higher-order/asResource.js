import { useContext, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import fetcher from '../../fetcher';
import { capitalize } from '../../utilities';

import NavButton from '../NavButton';
import DeleteButton from '../DeleteButton';
import BackLink from '../BackLink';
import MessageContext from '../contexts/MessageContext';

export default function asResource(
  Base,
  Form,
  resourceName,
  {
    route = (id) => `${resourceName}s/${id}`,
    redirect = () => null,
    formHeading = true,
    catchError = true,
  }
) {
  return function Resource() {
    const state = useLocation().state;
    const data = state?.[`${resourceName}Data`];
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(data);
    const [editOn, setEditOn] = useState(false);
    const [error, setError] = useState(null);
    const redirectObject = state?.back || redirect(resource);
    const { route: redirectRoute, state: redirectState } = redirectObject || {};

    const setMessage = useContext(MessageContext).set;

    const handleErrors = useCallback(
      ({ status, data }) => {
        if (catchError && status === 401 && data.error) {
          setMessage(<div className="error">{data.error}</div>);
          return navigate(redirectRoute, { state: redirectState });
        } else setError({ status, data, message: data.error });
      },
      [redirectRoute, redirectState, setMessage, navigate]
    );

    function handleDelete() {
      if (redirectRoute) {
        setMessage(`Successfully deleted ${resourceName}.`);
        navigate(redirectRoute, { state: redirectState });
      } else setError({ message: `This ${resourceName} no longer exists.` });
    }

    useEffect(() => {
      if (data) return;

      async function getResource() {
        const response = await fetcher(route(id));
        if (response.status < 400) setResource(response.data);
        else handleErrors(response);
      }
      getResource();
    }, [data, id, handleErrors]);

    function showEdit() {
      setEditOn(true);
    }

    function hideEdit() {
      setEditOn(false);
    }

    function finishEdit(data) {
      setResource(data);
      hideEdit();
    }

    if (error) {
      if (catchError)
        return (
          <div>
            <div className="error">{error.message}</div>
            <BackLink back={redirectObject} />
          </div>
        );
      else return <Base error={error} />;
    }
    if (!resource) return 'Loading...';

    return (
      <Base
        resource={resource}
        setResource={setResource}
        error={error}
        editForm={
          editOn && (
            <Form
              heading={formHeading}
              defaultValues={resource}
              action="update"
              id={resource?.id}
              back={false}
              close={hideEdit}
              completeAction={finishEdit}
            />
          )
        }
        editButton={
          <NavButton onClick={showEdit}>
            Edit {capitalize(resourceName)}
          </NavButton>
        }
        deleteButton={
          <DeleteButton
            resource={resourceName}
            id={resource?.id}
            route={route(id)}
            completeAction={handleDelete}
          />
        }
      />
    );
  };
}
