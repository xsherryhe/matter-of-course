import Comment from './Comment';
import CommentForm from './CommentForm';

export default function Comments({
  commentableType,
  commentableId,
  comments,
  setComments,
  commentsError,
  commentsAppendButton,
  commentsPagination,
}) {
  function completeNew(data) {
    setComments((comments) => [...comments, data]);
  }

  let main = 'Loading...';
  if (commentsError?.message)
    main = <div className="error">{commentsError.message}</div>;
  else if (comments)
    main = (
      <main>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {commentsAppendButton}
        <CommentForm
          action="create"
          commentableType={commentableType}
          commentableId={commentableId}
          completeAction={completeNew}
        />
        {commentsPagination}
      </main>
    );

  return (
    <div>
      <h3>Comments</h3>
      {main}
    </div>
  );
}
