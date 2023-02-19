import { useContext, useState, useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import BackLink from './BackLink';
import asResource from './higher-order/asResource';
import LessonForm from './LessonForm';
import LessonAssignments from './LessonAssignments';
import MessageContext from './contexts/MessageContext';
import Posts from './Posts';
import NavButton from './NavButton';
import LessonMain from './LessonMain';

function LessonBase({
  resource: lesson,
  error,
  editForm,
  editButton,
  deleteButton,
}) {
  const courseId = useParams().courseId || lesson?.course_id;
  const stateTab = useLocation().state?.tab;
  const [tab, setTab] = useState(stateTab || 'main');
  const [posts, setPosts] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const setMessage = useContext(MessageContext).set;

  function handlePostsErrors({ data }) {
    if (data.error) setPostsError(data.error);
  }

  useEffect(() => {
    if (!lesson) return;

    async function getPosts() {
      const response = await fetcher(`lessons/${lesson.id}/posts`);
      if (response.status < 400) setPosts(response.data);
      else handlePostsErrors(response);
    }
    if (tab === 'discussion' && !posts) getPosts();
  }, [lesson, posts, tab]);

  function tabTo(tabOption) {
    return function () {
      setTab(tabOption);
    };
  }

  if (error) {
    let displayError = '';
    if (error.status === 401) {
      setMessage('You are not authorized to view that lesson.');
      return <Navigate to={courseId ? `/course/${courseId}` : '/home'} />;
    }
    if (error.data?.error)
      displayError = <div className="error">{error.data.error}</div>;
    if (typeof error === 'string')
      displayError = <div className="error">{error}</div>;
    return (
      <div>
        {courseId && (
          <BackLink
            back={{
              route: `/course/${courseId}`,
              location: 'Course',
              state: { tab: 'lessons' },
            }}
          />
        )}
        {displayError}
      </div>
    );
  }

  return (
    <div>
      <BackLink
        back={{
          route: `/course/${courseId}`,
          location: 'Course',
          state: { tab: 'lessons' },
        }}
      />
      <h1>{lesson.title}</h1>
      {['main', 'assignments', 'discussion'].map((tabOption) => (
        <NavButton
          className="tab"
          disabled={tab === tabOption}
          key={tabOption}
          onClick={tabTo(tabOption)}
        >
          {capitalize(tabOption)}
        </NavButton>
      ))}
      {tab === 'main' && (
        <LessonMain
          lesson={lesson}
          editForm={editForm}
          editButton={editButton}
          deleteButton={deleteButton}
        />
      )}
      {tab === 'assignments' && (
        <LessonAssignments lesson={lesson} tab="assignments" />
      )}
      {tab === 'discussion' && (
        <Posts
          postable={lesson}
          postableType="lesson"
          posts={posts}
          postsError={postsError}
        />
      )}
    </div>
  );
}

const Lesson = asResource(LessonBase, LessonForm, 'lesson', {
  formHeading: false,
  catchError: false,
  redirect: (lesson) => lesson && { route: `/course/${lesson.course_id}` },
});
export default Lesson;
