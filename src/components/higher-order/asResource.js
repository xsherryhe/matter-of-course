import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import fetcher from '../../fetcher';

import NavButton from '../NavButton';
import DeleteButton from '../DeleteButton';
import { capitalize } from '../../utilities';
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
    const { route: redirectRoute, state: redirectState } =
      state?.back || redirect(resource) || {};

    const setMessage = useContext(MessageContext).set;

    function handleErrors({ status, data }) {
      if (catchError && data.error) return setError(data.error);
      else setError({ data, status });
    }

    function handleDelete() {
      if (redirectRoute) {
        setMessage(`Successfully deleted ${resourceName}.`);
        navigate(redirectRoute, { state: redirectState });
      } else setError(`This ${resourceName} no longer exists.`);
    }

    useEffect(() => {
      if (data) return;

      async function getResource() {
        const response = await fetcher(route(id));
        if (response.status < 400) setResource(response.data);
        else handleErrors(response);
      }
      getResource();
    }, [data, id]);

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
      if (catchError) return <div className="error">{error}</div>;
      else return <Base error={error} />;
    }
    if (!resource) return 'Loading...';

    return (
      <Base
        resource={resource}
        setResource={setResource}
        error={error}
        setError={setError}
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
            handleErrors={handleErrors}
          />
        }
      />
    );
  };
}
