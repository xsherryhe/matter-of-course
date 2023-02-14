import { capitalize } from '../utilities';

import asResource from './higher-order/asResource';
import NavLink from './NavLink';
import PostForm from './PostForm';

function PostBase({ resource: post, editForm, editButton, deleteButton }) {
  let main = (
    <main className="post">
      <h1>{post.title}</h1>
      <h2>{post.creator.name}</h2>
      <h3>{capitalize(post.creator_role)}</h3>
      {post.authorized && (
        <div className="buttons">
          {editButton}
          {deleteButton}
        </div>
      )}
      <div>{post.body}</div>
    </main>
  );

  return (
    <div>
      <NavLink
        to={`/${post.postable_type.toLowerCase()}/${
          post.postable_id
        }/discussion`}
      >
        Back to Discussion
      </NavLink>
      {editForm || main}
    </div>
  );
}

const Post = asResource(PostBase, PostForm, 'post', {
  redirect: (post) => ({
    route: `/${post.postable_type.toLowerCase()}/${
      post.postable_id
    }/discussion`,
  }),
});
export default Post;
