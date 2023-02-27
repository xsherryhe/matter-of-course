import { useState, useEffect } from 'react';
import fetcher from '../fetcher';

import Comments from './Comments';
import withAppendingPagination from './higher-order/withAppendingPagination';
import withErrorHandling from './higher-order/withErrorHandling';

function AppendedCommentsBase({
  commentable,
  commentableType,
  commentsPage,
  updateCommentsPage,
  commentsAppendButton,
  handleErrors,
  error,
}) {
  const [comments, setComments] = useState(null);

  useEffect(() => {
    async function getComments() {
      const response = await fetcher(
        `${commentableType}/${commentable.id}/comments`,
        { query: 'page=1' }
      );
      if (response.status < 400) {
        setComments(response.data.comments);
        updateCommentsPage(response.data);
      } else handleErrors(response);
    }

    async function appendComments() {
      const response = await fetcher(
        `${commentableType}/${commentable.id}/comments`,
        { query: `page=${commentsPage}` }
      );
      if (response.status < 400) {
        setComments((comments) =>
          comments
            ? [...comments, ...response.data.comments]
            : response.data.comments
        );
        updateCommentsPage(response.data);
      } else handleErrors(response);
    }
    (commentsPage === 1 ? getComments : appendComments)();
  }, [
    commentableType,
    commentable,
    commentsPage,
    updateCommentsPage,
    handleErrors,
  ]);

  return (
    <Comments
      commentableType={commentableType}
      commentableId={commentable.id}
      comments={comments}
      setComments={setComments}
      commentsError={error}
      commentsAppendButton={commentsAppendButton}
    />
  );
}

const ErrorHandledAppendedComments = withErrorHandling(AppendedCommentsBase, {
  catchError: false,
});

const AppendedComments = withAppendingPagination(
  ErrorHandledAppendedComments,
  'comments'
);
export default AppendedComments;
