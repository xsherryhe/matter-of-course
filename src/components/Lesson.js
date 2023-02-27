import { useContext, useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import '../styles/Lesson.css';
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
import withPagination from './higher-order/withPagination';
import NavLink from './NavLink';
import withErrorHandling from './higher-order/withErrorHandling';

function LessonBase({
  resource: lesson,
  setResource: setLesson,
  error,
  editForm,
  editButton,
  deleteButton,
  postsPage,
  updatePostsPage,
  postsPagination,
  postsError,
  handlePostsErrors,
}) {
  const courseId = useParams().courseId || lesson?.course_id;
  const stateTab = useLocation().state?.tab;
  const navigate = useNavigate();
  const [tab, setTab] = useState(stateTab || 'main');
  const [posts, setPosts] = useState(null);
  const setMessage = useContext(MessageContext).set;

  useEffect(() => {
    if (!lesson) return;

    async function getPosts() {
      const response = await fetcher(`lessons/${lesson.id}/posts`, {
        query: `page=${postsPage}`,
      });
      if (response.status < 400) {
        setPosts(response.data.posts);
        updatePostsPage(response.data);
      } else handlePostsErrors(response);
    }
    if (tab === 'discussion') getPosts();
  }, [lesson, tab, postsPage, updatePostsPage, handlePostsErrors]);

  useEffect(() => {
    if (error?.status !== 401) return;

    setMessage(
      <div className="error">You are not authorized to view that lesson.</div>
    );
    navigate(courseId ? `/course/${courseId}` : '/home');
  }, [error, courseId, setMessage, navigate]);

  function tabTo(tabOption) {
    return function () {
      setTab(tabOption);
    };
  }

  if (error) {
    let displayError = '';
    if (error.message)
      displayError = <div className="error">{error.message}</div>;
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
    <div className="lesson">
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
        <LessonAssignments
          lesson={lesson}
          setLesson={setLesson}
          editable={true}
          tab="assignments"
        />
      )}
      {tab === 'discussion' && (
        <Posts
          postable={lesson}
          postableType="lesson"
          posts={posts}
          postsError={postsError}
          postsPage={postsPage}
          postsPagination={postsPagination}
        />
      )}
      <div className="adjacent-buttons">
        {['previous', 'next'].map(
          (adjacent) =>
            lesson.adjacent_ids[adjacent] && (
              <NavLink
                className={adjacent}
                key={adjacent}
                to={`/course/${lesson.course_id}/lesson/${lesson.adjacent_ids[adjacent]}`}
              >
                <button>{capitalize(adjacent)} Lesson</button>
              </NavLink>
            )
        )}
      </div>
    </div>
  );
}

const PaginatedLessonBase = withPagination(LessonBase, 'posts');
const ErrorHandledLessonBase = withErrorHandling(PaginatedLessonBase, {
  resourceName: 'posts',
  catchError: false,
});
const Lesson = asResource(ErrorHandledLessonBase, LessonForm, 'lesson', {
  formHeading: false,
  catchError: false,
  redirect: (lesson) => lesson && { route: `/course/${lesson.course_id}` },
});
export default Lesson;
