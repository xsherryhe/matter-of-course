import { useState, useEffect } from 'react';
import fetcher from '../fetcher';

import Comments from './Comments';
import withPagination from './higher-order/withPagination';

function PaginatedCommentsBase({
  commentable,
  commentableType,
  commentsPage,
  updateCommentsPage,
  commentsPagination,
}) {
  const [comments, setComments] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ data }) {
    if (data.error) setError(data.error);
  }

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
  }, [commentable, commentableType, commentsPage, updateCommentsPage]);

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

const PaginatedComments = withPagination(PaginatedCommentsBase, 'comments');
export default PaginatedComments;
