import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import withPagination from './higher-order/withPagination';
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
  rosterPage,
  updateRosterPage,
  rosterPagination,
  assignmentsPage,
  updateAssignmentsPage,
  assignmentsPagination,
  incompleteSubmissionsPage,
  updateIncompleteSubmissionsPage,
  incompleteSubmissionsPagination,
  completeSubmissionsPage,
  updateCompleteSubmissionsPage,
  completeSubmissionsPagination,
  postsPage,
  updatePostsPage,
  postsPagination,
}) {
  const [roster, setRoster] = useState(null);
  const [rosterError, setRosterError] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [assignmentsError, setAssignmentsError] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [posts, setPosts] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const stateTab = useLocation().state?.tab;
  const [tab, setTab] = useState(stateTab || 'overview');

  function handleRosterErrors({ data }) {
    if (data.error) setRosterError(data.error);
  }

  function handleAssignmentsErrors({ data }) {
    if (data.error) setAssignmentsError(data.error);
  }

  function handleSubmissionsErrors({ data }) {
    if (data.error) setSubmissionsError(data.error);
  }

  function handlePostsErrors({ data }) {
    if (data.error) setPostsError(data.error);
  }

  useEffect(() => {
    async function getRoster() {
      const response = await fetcher(`courses/${course.id}/enrollments`, {
        query: `page=${rosterPage}`,
      });
      if (response.status < 400) {
        setRoster(response.data.enrollments);
        updateRosterPage(response.data);
      } else handleRosterErrors(response);
    }

    async function getAssignments() {
      const response = await fetcher(`courses/${course.id}/assignments`, {
        query: `page=${assignmentsPage}`,
      });
      if (response.status < 400) {
        setAssignments(response.data.assignments);
        updateAssignmentsPage(response.data);
      } else handleAssignmentsErrors(response);
    }

    async function getSubmissions() {
      const response = await fetcher('current_user', {
        headers: { 'Content-Type': 'application/json' },
        query: `with=all_assignment_submissions&scope=course_${course.id}&page=${incompleteSubmissionsPage},${completeSubmissionsPage}`,
      });
      if (response.status < 400) {
        setSubmissions(response.data.all_assignment_submissions);
        updateIncompleteSubmissionsPage(
          response.data.all_assignment_submissions.incomplete
        );
        updateCompleteSubmissionsPage(
          response.data.all_assignment_submissions.complete
        );
      } else handleSubmissionsErrors(response);
    }

    async function getPosts() {
      const response = await fetcher(`courses/${course.id}/posts`, {
        query: `page=${postsPage}`,
      });
      if (response.status < 400) {
        setPosts(response.data.posts);
        updatePostsPage(response.data);
      } else handlePostsErrors(response);
    }

    if (tab === 'roster') getRoster();
    if (tab === 'assignments' && course.authorized) getAssignments();
    if (tab === 'assignments' && course.enrolled && !course.authorized)
      getSubmissions();
    if (tab === 'discussion') getPosts();
  }, [
    tab,
    course,
    rosterPage,
    updateRosterPage,
    assignmentsPage,
    updateAssignmentsPage,
    incompleteSubmissionsPage,
    updateIncompleteSubmissionsPage,
    completeSubmissionsPage,
    updateCompleteSubmissionsPage,
    postsPage,
    updatePostsPage,
  ]);

  function tabTo(tabOption) {
    return function () {
      setTab(tabOption);
    };
  }

  if (error) {
    if (error.status === 401) return <CourseStatusError error={error.data} />;
    if (error.message) return <div className="error">{error.mesage}</div>;
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

    const assignmentsComponent = course.authorized ? (
      <CourseAssignments
        course={course}
        assignments={assignments}
        assignmentsError={assignmentsError}
        assignmentsPage={assignmentsPage}
        assignmentsPagination={assignmentsPagination}
        tabToLessons={tabTo('lessons')}
      />
    ) : (
      <CourseUserAssignmentSubmissions
        course={course}
        submissions={submissions}
        submissionsError={submissionsError}
        incompleteSubmissionsPage={incompleteSubmissionsPage}
        incompleteSubmissionsPagination={incompleteSubmissionsPagination}
        completeSubmissionsPage={completeSubmissionsPage}
        completeSubmissionsPagination={completeSubmissionsPagination}
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
            rosterPage={rosterPage}
            rosterPagination={rosterPagination}
          />
        )}
        {tab === 'lessons' && (
          <CourseLessons course={course} setCourse={setCourse} />
        )}
        {tab === 'assignments' && assignmentsComponent}
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
            postsPage={postsPage}
            postsPagination={postsPagination}
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

const PaginatedCourseBase = [
  'roster',
  'assignments',
  'incompleteSubmissions',
  'completeSubmissions',
  'posts',
].reduce(
  (Component, resourceName) => withPagination(Component, resourceName),
  CourseBase
);
const Course = asResource(PaginatedCourseBase, CourseForm, 'course', {
  formHeading: false,
  catchError: false,
  redirect: () => ({ route: '/my-courses' }),
});
export default Course;
