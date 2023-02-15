import { useState, useEffect } from 'react';
import fetcher from '../fetcher';
import Comment from './Comment';

import CommentForm from './CommentForm';

export default function Comments({ commentable, commentableType }) {
  const [comments, setComments] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

  useEffect(() => {
    async function getComments() {
      const response = await fetcher(
        `${commentableType}/${commentable.id}/comments`
      );
      if (response.status < 400) setComments(response.data);
      else handleErrors(response);
    }
    getComments();
  }, [commentable, commentableType]);

  function completeNew(data) {
    setComments((comments) => [...comments, data]);
  }

  let main = 'Loading...';
  if (error) main = <div className="error">{error}</div>;
  else if (comments)
    main = (
      <main>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </main>
    );

  return (
    <div>
      <h3>Comments</h3>
      {main}
      <CommentForm
        action="create"
        commentableType={commentableType}
        commentableId={commentable.id}
        completeAction={completeNew}
      />
    </div>
  );
}
