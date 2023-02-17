import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import asResource from './higher-order/asResource';
import NavButton from './NavButton';
import CourseStatusNotice from './CourseStatusNotice';
import CourseForm from './CourseForm';
import CourseInstructors from './CourseInstructors';
import CourseLessons from './CourseLessons';
import CourseRoster from './CourseRoster';
import CourseAssignments from './CourseAssignments';
import CourseStatusError from './CourseStatusError';
import CourseOverview from './CourseOverview';
import Posts from './Posts';

function CourseBase({
  resource: course,
  setResource: setCourse,
  error,
  setError,
  editForm,
  editButton,
  deleteButton,
}) {
  const [roster, setRoster] = useState(null);
  const [rosterError, setRosterError] = useState(null);
  const [posts, setPosts] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const stateTab = useLocation().state?.tab;
  const [tab, setTab] = useState((course.authorized && stateTab) || 'overview');

  function handleRosterErrors({ data }) {
    if (data.error) setRosterError(data.error);
  }

  function handlePostsErrors({ data }) {
    if (data.error) setPostsError(data.error);
  }

  useEffect(() => {
    async function getRoster() {
      const response = await fetcher(`courses/${course.id}/enrollments`);
      if (response.status < 400) setRoster(response.data);
      else handleRosterErrors(response);
    }

    async function getPosts() {
      const response = await fetcher(`courses/${course.id}/posts`);
      if (response.status < 400) setPosts(response.data);
      else handlePostsErrors(response);
    }

    if (tab === 'roster' && !roster) getRoster();
    if (tab === 'discussion' && !posts) getPosts();
  }, [tab, course, roster, posts]);

  function tabTo(tabOption) {
    return function () {
      setTab(tabOption);
    };
  }

  if (error) {
    if (error.status === 401) return <CourseStatusError error={error.data} />;
    if (error.data?.error)
      return <div className="error">{error.data.error}</div>;
    if (typeof error === 'string') return <div className="error">{error}</div>;
  }

  let main = (
    <main>
      <CourseOverview course={course} setCourse={setCourse} />
      <CourseLessons course={course} setCourse={setCourse} />
    </main>
  );

  if (course.authorized)
    main = (
      <main>
        {[
          'overview',
          'roster',
          'lessons',
          'assignments',
          'instructors',
          'discussion',
        ].map((tabOption) => (
          <NavButton
            key={tabOption}
            className="tab"
            onClick={tabTo(tabOption)}
            disabled={tab === tabOption}
          >
            {capitalize(tabOption)}
          </NavButton>
        ))}
        {tab === 'overview' && (
          <CourseOverview
            course={course}
            setCourse={setCourse}
            setError={setError}
            editButton={editButton}
            editForm={editForm}
            deleteButton={deleteButton}
          />
        )}
        {tab === 'roster' && (
          <CourseRoster
            course={course}
            roster={roster}
            rosterError={rosterError}
          />
        )}
        {tab === 'lessons' && (
          <CourseLessons course={course} setCourse={setCourse} />
        )}
        {tab === 'assignments' && <CourseAssignments course={course} />}
        {tab === 'instructors' && (
          <CourseInstructors
            course={course}
            setCourse={setCourse}
            editable={true}
          />
        )}
        {tab === 'discussion' && (
          <Posts
            postable={course}
            postableType="course"
            posts={posts}
            postsError={postsError}
          />
        )}
      </main>
    );

  return (
    <div>
      {<CourseStatusNotice status={course.status} />}
      <h1>{course.title}</h1>
      {main}
    </div>
  );
}

const Course = asResource(CourseBase, CourseForm, 'course', {
  formHeading: false,
  catchError: false,
  redirect: () => ({ route: '/my-courses' }),
});
export default Course;
