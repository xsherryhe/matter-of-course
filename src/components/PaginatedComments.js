import { useState, useEffect } from 'react';
import fetcher from '../fetcher';

import Comments from './Comments';
import withErrorHandling from './higher-order/withErrorHandling';
import withPagination from './higher-order/withPagination';

function PaginatedCommentsBase({
  commentable,
  commentableType,
  commentsPage,
  updateCommentsPage,
  commentsPagination,
  handleErrors,
  error,
}) {
  const [comments, setComments] = useState(null);

  useEffect(() => {
    async function getComments() {
      const response = await fetcher(
        `${commentableType}/${commentable.id}/comments`,
        { query: `page=${commentsPage}` }
      );
      if (response.status < 400) {
        setComments(response.data.comments);
        updateCommentsPage(response.data);
      } else handleErrors(response);
    }
    getComments();
  }, [
    commentable,
    commentableType,
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
      commentsPagination={commentsPagination}
    />
  );
}

const ErrorHandledPaginatedComments = withErrorHandling(PaginatedCommentsBase, {
  catchError: false,
});

const PaginatedComments = withPagination(
  ErrorHandledPaginatedComments,
  'comments'
);
export default PaginatedComments;
