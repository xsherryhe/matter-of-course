import { useState } from 'react';
import { capitalize } from '../utilities';

import NavButton from './NavButton';
import DeleteButton from './DeleteButton';
import CommentForm from './CommentForm';

export default function Comment({ comment: initialComment }) {
  const [editOn, setEditOn] = useState(false);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState(null);

  if (!comment) return;

  const {
    id,
    authorized,
    body,
    creator_role: creatorRole,
    creator: { name },
  } = comment;

  function showEdit() {
    setEditOn(true);
  }

  function hideEdit() {
    setEditOn(false);
  }

  function finishEdit(data) {
    setComment(data);
    hideEdit();
  }

  function finishDelete() {
    setComment(null);
  }

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  if (editOn)
    return (
      <CommentForm
        defaultValues={comment}
        action="update"
        id={id}
        close={hideEdit}
        completeAction={finishEdit}
      />
    );

  return (
    <div>
      <div>
        {name}
        {creatorRole && <span>{capitalize(creatorRole)}</span>}
      </div>
      {authorized && (
        <div className="buttons">
          <NavButton onClick={showEdit}>Edit</NavButton>
          <DeleteButton
            resource="comment"
            id={id}
            buttonText="Delete"
            completeAction={finishDelete}
            handleErrors={handleErrors}
          />
          {error && <div className="error">{error}</div>}
        </div>
      )}
      <div>{body}</div>
    </div>
  );
}
