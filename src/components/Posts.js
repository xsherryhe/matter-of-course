import { useState } from 'react';
import { capitalize } from '../utilities';

import NavLink from './NavLink';
import PostForm from './PostForm';

export default function Posts({ postable, postableType, posts, postsError }) {
  const [newPostOn, setNewPostOn] = useState(false);

  function showNewPost() {
    setNewPostOn(true);
  }

  function hideNewPost() {
    setNewPostOn(false);
  }

  if (postsError) return <div className="error">{postsError}</div>;

  let postsMain = 'Loading...';
  if (posts) {
    if (posts.length)
      postsMain = posts.map(({ id, title }) => (
        <div key={id}>
          <NavLink
            to={`/${postableType}/${postable.id}/post/${id}`}
            state={{
              back: {
                route: `/${postableType}/${postable.id}`,
                location: capitalize(postableType),
                state: { tab: 'discussion' },
              },
            }}
          >
            {title}
          </NavLink>
        </div>
      ));
    else postsMain = 'No discussion yet!';
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
      <main>{postsMain}</main>
    </div>
  );
}
