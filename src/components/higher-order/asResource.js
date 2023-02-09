import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fetcher from '../../fetcher';

import NavButton from '../NavButton';
import DeleteButton from '../DeleteButton';
import { capitalize } from '../../utilities';

export default function asResource(
  Base,
  Form,
  resourceName,
  {
    route = (id) => `${resourceName}s/${id}`,
    formHeading = true,
    catchError = true,
  }
) {
  return function Resource() {
    const data = useLocation().state?.[`${resourceName}Data`];
    const { id } = useParams();
    const [resource, setResource] = useState(data);
    const [editOn, setEditOn] = useState(false);
    const [error, setError] = useState(null);

    function handleErrors({ status, data }) {
      if (catchError && data.error) return setError(data.error);
      else setError({ data, status });
    }

    function handleDelete() {
      setError(`This ${resourceName} no longer exists.`);
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
          />
        }
      />
    );
  };
}
