import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import CourseStatusNotice from './CourseStatusNotice';
import CourseForm from './CourseForm';
import asResource from './higher-order/asResource';
import CourseInstructors from './CourseInstructors';
import CourseLessons from './CourseLessons';
import CourseRoster from './CourseRoster';
import CourseAssignments from './CourseAssignments';
import NavButton from './NavButton';
import CourseStatusError from './CourseStatusError';
import CourseOverview from './CourseOverview';
import { useEffect } from 'react';

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
  const stateTab = useLocation().state?.tab;
  const [authorizedTab, setAuthorizedTab] = useState(
    (course.authorized && stateTab) || 'overview'
  );

  function handleRosterErrors({ data }) {
    if (data.error) setRosterError(data.error);
  }

  useEffect(() => {
    if (authorizedTab !== 'roster' || roster) return;

    async function getRoster() {
      const response = await fetcher(`courses/${course.id}/enrollments`);
      if (response.status < 400) setRoster(response.data);
      else handleRosterErrors(response);
    }
    getRoster();
  }, [authorizedTab, course, roster]);

  function tabTo(newTab) {
    return function () {
      setAuthorizedTab(newTab);
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
        {['overview', 'roster', 'lessons', 'assignments', 'instructors'].map(
          (tab) => (
            <NavButton
              key={tab}
              className="tab"
              onClick={tabTo(tab)}
              disabled={tab === authorizedTab}
            >
              {capitalize(tab)}
            </NavButton>
          )
        )}
        {authorizedTab === 'overview' && (
          <CourseOverview
            course={course}
            setCourse={setCourse}
            setError={setError}
            editButton={editButton}
            editForm={editForm}
            deleteButton={deleteButton}
          />
        )}
        {authorizedTab === 'roster' && (
          <CourseRoster
            course={course}
            roster={roster}
            rosterError={rosterError}
          />
        )}
        {authorizedTab === 'lessons' && (
          <CourseLessons course={course} setCourse={setCourse} />
        )}
        {authorizedTab === 'assignments' && (
          <CourseAssignments course={course} />
        )}
        {authorizedTab === 'instructors' && (
          <CourseInstructors
            course={course}
            setCourse={setCourse}
            editable={true}
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
