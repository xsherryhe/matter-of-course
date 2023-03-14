import { useState } from 'react';
import { capitalize } from '../utilities';

import NavButton from './NavButton';
import DeleteButton from './DeleteButton';
import CommentForm from './CommentForm';
import User from './User';

export default function Comment({ comment: initialComment }) {
  const [editOn, setEditOn] = useState(false);
  const [comment, setComment] = useState(initialComment);

  if (!comment) return;

  const { id, authorized, body, creator_role: creatorRole, creator } = comment;

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
        <User user={creator} />
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
          />
        </div>
      )}
      <div>{body}</div>
    </div>
  );
}
