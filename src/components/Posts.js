import { useState } from 'react';
import { capitalize } from '../utilities';

import NavLink from './NavLink';
import PostForm from './PostForm';

export default function Posts({
  postable,
  postableType,
  posts,
  postsError,
  postsPage,
  postsPagination,
}) {
  const [newPostOn, setNewPostOn] = useState(false);

  function showNewPost() {
    setNewPostOn(true);
  }

  function hideNewPost() {
    setNewPostOn(false);
  }

  if (postsError) return <div className="error">{postsError}</div>;

  let main = 'Loading...';
  if (posts) {
    if (posts.length)
      main = (
        <div>
          {posts.map(({ id, title }) => (
            <div key={id}>
              <NavLink
                to={`/${postableType}/${postable.id}/post/${id}`}
                state={{
                  back: {
                    route: `/${postableType}/${postable.id}`,
                    location: capitalize(postableType),
                    state: { tab: 'discussion', postsPage },
                  },
                }}
              >
                {title}
              </NavLink>
            </div>
          ))}
          {postsPagination}
        </div>
      );
    else main = 'No discussion yet!';
  }

  return (
    <div>
      <h2>Discussion</h2>
      {!newPostOn && (
        <button onClick={showNewPost}>Add a Discussion Post</button>
      )}
      {newPostOn && (
        <PostForm
          postableType={postableType}
          postableId={postable.id}
          heading={false}
          action="create"
          close={hideNewPost}
        />
      )}
      <main>{main}</main>
    </div>
  );
}
