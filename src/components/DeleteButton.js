import { useContext } from 'react';
import { capitalize } from '../utilities';
import PopUpContext from './contexts/PopUpContext';
import DeleteConfirmPopUp from './DeleteConfirmPopUp';

export default function DeleteButton({
  route,
  resource,
  id,
  buttonText,
  confirmText,
  action = 'delete',
  completeAction,
  handleErrors,
}) {
  const setPopUp = useContext(PopUpContext).set;

  function handleClick() {
    setPopUp(
      <DeleteConfirmPopUp
        route={route}
        resource={resource}
        id={id}
        action={action}
        confirmText={confirmText}
        completeAction={completeAction}
        handleErrors={handleErrors}
      />
    );
  }

  return (
    <button onClick={handleClick}>
      {buttonText || `${capitalize(action)} ${capitalize(resource)}`}
    </button>
  );
}
