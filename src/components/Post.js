import { useLocation } from 'react-router-dom';
import { capitalize } from '../utilities';

import asResource from './higher-order/asResource';
import BackLink from './BackLink';
import PostForm from './PostForm';
import PaginatedComments from './PaginatedComments';
import User from './User';

function PostBase({ resource: post, editForm, editButton, deleteButton }) {
  const back = useLocation().state?.back || {
    route: `/${post.postable_type.toLowerCase()}/${post.postable_id}`,
    location: capitalize(post.postable_type),
    state: { tab: 'discussion' },
  };

  let main = (
    <main className="post">
      <h1>{post.title}</h1>
      <h2 className="creator">
        <User user={post.creator} />
      </h2>
      <h3>{capitalize(post.creator_role)}</h3>
      {post.authorized && (
        <div className="buttons">
          {editButton}
          {deleteButton}
        </div>
      )}
      <div>{post.body}</div>
      <PaginatedComments commentable={post} commentableType="post" />
    </main>
  );

  return (
    <div>
      <BackLink back={back} />
      {editForm || main}
    </div>
  );
}

const Post = asResource(PostBase, PostForm, 'post', {
  redirect: (post) =>
    post && {
      route: `/${post.postable_type.toLowerCase()}/${post.postable_id}`,
      state: { tab: 'discussion' },
    },
});
export default Post;
