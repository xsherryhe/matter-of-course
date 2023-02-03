import { useContext } from 'react';
import { capitalize } from '../utilities';
import PopUpContext from './contexts/PopUpContext';
import DeleteConfirmPopUp from './DeleteConfirmPopUp';

export default function DeleteButton({ resource, id, completeAction }) {
  const setPopUp = useContext(PopUpContext).set;

  function handleClick() {
    setPopUp(
      <DeleteConfirmPopUp
        resource={resource}
        id={id}
        completeAction={completeAction}
      />
    );
  }

  return <button onClick={handleClick}>Delete {capitalize(resource)}</button>;
}
