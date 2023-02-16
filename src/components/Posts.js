import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';
import CourseStatusError from './CourseStatusError';
import NavLink from './NavLink';
import PostForm from './PostForm';

export default function Posts() {
  const initialPostable = useLocation().state?.postable;
  const { postableType, postableId } = useParams();
  const [postable, setPostable] = useState(initialPostable);
  const [newPostOn, setNewPostOn] = useState(false);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  function handleErrors({ status, data }) {
    if (status === 401 && data.status)
      setError(<CourseStatusError error={data} />);
    else if (data.error) setError(data.error);
  }

  useEffect(() => {
    if (postable) return;

    async function getPostable() {
      const response = await fetcher(`${postableType}s/${postableId}`);
      if (response.status < 400) setPostable(response.data);
      else handleErrors(response);
    }
    getPostable();
  }, [postable, postableType, postableId]);

  useEffect(() => {
    if (!postable) return;

    async function getPosts() {
      const response = await fetcher(`${postableType}s/${postableId}/posts`);
      if (response.status < 400) setPosts(response.data);
      else handleErrors(response);
    }
    getPosts();
  }, [postable, postableType, postableId]);

  function showNewPost() {
    setNewPostOn(true);
  }

  function hideNewPost() {
    setNewPostOn(false);
  }

  if (error) return <div className="error">{error}</div>;
  if (!postable) return 'Loading...';

  let postsMain = 'Loading...';
  if (posts) {
    if (posts.length)
      postsMain = posts.map(({ id, title }) => (
        <div key={id}>
          <NavLink to={`/${postableType}/${postableId}/post/${id}`}>
            {title}
          </NavLink>
        </div>
      ));
    else postsMain = 'No discussion yet!';
  }

  return (
    <div>
      <NavLink to={`/${postableType}/${postableId}`}>
        Back to {capitalize(postableType)}
      </NavLink>
      <h1>Discussion for {postable.title}</h1>
      {!newPostOn && (
        <button onClick={showNewPost}>Add a Discussion Post</button>
      )}
      {newPostOn && (
        <PostForm heading={false} action="create" close={hideNewPost} />
      )}
      <main>{postsMain}</main>
    </div>
  );
}
