import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fetcher from '../../fetcher';

import NavButton from '../NavButton';
import DeleteButton from '../DeleteButton';

export default function asResource(
  Base,
  Form,
  resourceName,
  { catchError = true }
) {
  return function Resource() {
    const data = useLocation()?.state?.[`${resourceName}Data`];
    const { id } = useParams();
    const [resource, setResource] = useState(data);
    const [editOn, setEditOn] = useState(false);
    const [error, setError] = useState(null);

    function handleErrors(data, status) {
      if (catchError && data.error) return setError(data.error);
      else setError({ data, status });
    }

    useEffect(() => {
      if (data) return;

      async function getResource() {
        const response = await fetcher(`${resourceName}s/${id}`);
        const data = await response.json();
        if (response.status < 400) setResource(data);
        else handleErrors(data, response.status);
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

    if (editOn)
      return (
        <Form
          defaultValues={resource}
          action="update"
          id={resource.id}
          completeAction={finishEdit}
        />
      );

    return (
      <Base
        resource={resource}
        error={error}
        editButton={<NavButton onClick={showEdit}>Edit Course</NavButton>}
        deleteButton={
          <DeleteButton
            resource={resourceName}
            id={resource.id}
            completeAction={setError}
          />
        }
      />
    );
  };
}
