import { useContext, useNavigate } from "react";

import DeleteButton from "./DeleteButton";
import MessageContext from "./contexts/MessageContext";

export default function CancelAccountButton() {
  const setMessage = useContext(MessageContext).set;
  const navigate = useNavigate();

  function completeCancel() {
    setMessage('Your account has been deleted.');
    navigate('/');
  }

  return (
    <DeleteButton
      route="users"
      resource="user"
      buttonText="Cancel My Account"
      completeAction={completeCancel}
      confirmText="Are you sure you wish to delete your account?"
    />
  );
}
