import { useState, useEffect } from 'react';
import fetcher from '../fetcher';

import Comments from './Comments';
import withAppendingPagination from './higher-order/withAppendingPagination';

function AppendedCommentsBase({
  commentable,
  commentableType,
  commentsPage,
  updateCommentsPage,
  commentsAppendButton,
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
  }, [commentableType, commentable, commentsPage, updateCommentsPage]);

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

const AppendedComments = withAppendingPagination(
  AppendedCommentsBase,
  'comments'
);
export default AppendedComments;
