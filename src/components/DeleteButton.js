import { useState, useContext } from 'react';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import PopUpContext from './contexts/PopUpContext';
import DeleteConfirmPopUp from './DeleteConfirmPopUp';
import withErrorHandling from './higher-order/withErrorHandling';
import NavButton from './NavButton';

function DeleteButtonBase({
  route,
  resource,
  id,
  buttonText,
  action = 'delete',
  completeAction,
  handleErrors,
  confirm = true,
  confirmText,
}) {
  const [loading, setLoading] = useState(false);
  const setPopUp = useContext(PopUpContext).set;

  async function handleDelete() {
    setLoading(true);
    const response = await fetcher(route || `${resource}s/${id}`, {
      method: 'DELETE',
    });
    if (response.status < 400) completeAction();
    else handleErrors(response);
    setLoading(false);
  }

  function handleClick(e) {
    e.preventDefault();
    if (confirm)
      setPopUp(
        <DeleteConfirmPopUp
          resource={resource}
          action={action}
          confirmText={confirmText}
          handleDelete={handleDelete}
          loading={loading}
        />
      );
    else handleDelete();
  }

  return (
    <NavButton disabled={loading} onClick={handleClick}>
      {buttonText || `${capitalize(action)} ${capitalize(resource)}`}
    </NavButton>
  );
}

const DeleteButton = withErrorHandling(DeleteButtonBase, { routed: false });
export default DeleteButton;
