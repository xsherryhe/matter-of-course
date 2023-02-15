import { useState } from 'react';

import NavButton from './NavButton';
import CommentForm from './CommentForm';

export default function Comment({ comment: initialComment }) {
  const [editOn, setEditOn] = useState(false);
  const [comment, setComment] = useState(initialComment);

  const {
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

  if (editOn)
    return (
      <CommentForm
        defaultValues={comment}
        action="update"
        id={comment.id}
        close={hideEdit}
        completeAction={finishEdit}
      />
    );

  return (
    <div>
      <div>
        {name}
        {creatorRole && <span>{creatorRole}</span>}
      </div>
      {authorized && <NavButton onClick={showEdit}>Edit</NavButton>}
      <div>{body}</div>
    </div>
  );
}
