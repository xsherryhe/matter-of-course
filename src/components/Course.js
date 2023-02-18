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
import CourseUserAssignmentSubmissions from './CourseUserAssignmentSubmissions';
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
  const [submissions, setSubmissions] = useState(null);
  const [submissionsError, setSubmissionsError] = useState(null);
  const stateTab = useLocation().state?.tab;
  const [tab, setTab] = useState(stateTab || 'overview');

  function handleRosterErrors({ data }) {
    if (data.error) setRosterError(data.error);
  }

  function handlePostsErrors({ data }) {
    if (data.error) setPostsError(data.error);
  }

  function handleSubmissionsErrors({ data }) {
    if (data.error) setSubmissionsError(data.error);
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

    async function getSubmissions() {
      const response = await fetcher('current_user', {
        query: `with=all_assignment_submissions&scope=course_${course.id}`,
      });
      if (response.status < 400)
        setSubmissions(response.data.all_assignment_submissions);
      else handleSubmissionsErrors(response);
    }

    if (tab === 'roster' && !roster) getRoster();
    if (tab === 'discussion' && !posts) getPosts();
    if (
      tab === 'assignments' &&
      !submissions &&
      course.enrolled &&
      !course.authorized
    )
      getSubmissions();
  }, [tab, course, roster, posts, submissions]);

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
    </main>
  );

  if (course.enrolled || course.authorized) {
    const tabOptions = course.authorized
      ? [
          'overview',
          'roster',
          'lessons',
          'assignments',
          'instructors',
          'discussion',
        ]
      : ['overview', 'lessons', 'assignments', 'discussion'];

    const assignments = course.authorized ? (
      <CourseAssignments
        course={course}
        setCourse={setCourse}
        tabToLessons={tabTo('lessons')}
      />
    ) : (
      <CourseUserAssignmentSubmissions
        course={course}
        submissions={submissions}
        submissionsError={submissionsError}
      />
    );

    main = (
      <main>
        {tabOptions.map((tabOption) => (
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
        {tab === 'assignments' && assignments}
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
  }

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
