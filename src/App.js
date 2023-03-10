import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import fetcher from './fetcher';

import UserContext from './components/contexts/UserContext';
import MessageContext from './components/contexts/MessageContext';
import Header from './components/Header';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Courses from './components/Courses';
import Course from './components/Course';
import UserCourses from './components/UserCourses';
import CourseForm from './components/CourseForm';
import PopUpContext from './components/contexts/PopUpContext';
import Invitations from './components/Invitations';
import LessonForm from './components/LessonForm';
import Lesson from './components/Lesson';
import UserAllAssignmentSubmissions from './components/UserAllAssignmentSubmissions';
import AssignmentSubmissionForm from './components/AssignmentSubmissionForm';
import AssignmentSubmission from './components/AssignmentSubmission';
import AssignmentSubmissions from './components/AssignmentSubmissions';
import Messages from './components/Messages';
import MessageForm from './components/MessageForm';
import Post from './components/Post';
import Profile from './components/Profile';
import withAuthentication from './components/higher-order/withAuthentication';
import EditProfileAndRegistration from './components/EditProfileAndRegistration';
import ForgotPassword from './components/ForgotPassword';
import EditPassword from './components/EditPassword';
import CancelAccount from './components/CancelAccount';

const AuthenticatedHome = withAuthentication(Home, {
  authenticatedPage: false,
});
const AuthenticatedSignUp = withAuthentication(SignUp, {
  authenticatedPage: false,
});
const AuthenticatedLogIn = withAuthentication(LogIn, {
  authenticatedPage: false,
});
const AuthenticatedForgotPassword = withAuthentication(ForgotPassword, {
  authenticatedPage: false,
});
const AuthenticatedEditPassword = withAuthentication(EditPassword, {
  authenticatedPage: false,
});
const AuthenticatedCourses = withAuthentication(Courses, {
  authenticatedPage: false,
});
const AuthenticatedCourse = withAuthentication(Course, {
  authenticatedPage: false,
});
const AuthenticatedUserCourses = withAuthentication(UserCourses);
const AuthenticatedCourseForm = withAuthentication(CourseForm);
const AuthenticatedLessonForm = withAuthentication(LessonForm);
const AuthenticatedLesson = withAuthentication(Lesson);
const AuthenticatedProfile = withAuthentication(Profile);
const AuthenticatedEditProfileAndRegistration = withAuthentication(
  EditProfileAndRegistration
);
const AuthenticatedCancelAccount = withAuthentication(CancelAccount);
const AuthenticatedInvitations = withAuthentication(Invitations);
const AuthenticatedUserAllAssignmentSubmissions = withAuthentication(
  UserAllAssignmentSubmissions
);
const AuthenticatedAssignmentSubmissionForm = withAuthentication(
  AssignmentSubmissionForm
);
const AuthenticatedAssignmentSubmissions = withAuthentication(
  AssignmentSubmissions
);
const AuthenticatedAssignmentSubmission =
  withAuthentication(AssignmentSubmission);
const AuthenticatedMessages = withAuthentication(Messages);
const AuthenticatedMessageForm = withAuthentication(MessageForm);
const AuthenticatedPost = withAuthentication(Post);

function App() {
  const [popUp, setPopUp] = useState(null);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const response = await fetcher('current_user');
      if (response.status < 400) setUser(response.data);
    }
    getUser();
  }, []);

  if (user === null) return 'Loading...';

  return (
    <div className="App">
      <BrowserRouter>
        <PopUpContext.Provider value={{ popUp, set: setPopUp }}>
          <MessageContext.Provider value={{ message, set: setMessage }}>
            <UserContext.Provider value={{ user, set: setUser }}>
              <Header />
              {message}
              <main>
                <Routes>
                  <Route path="/" element={<AuthenticatedHome />} />
                  <Route path="/home" element={<AuthenticatedHome />} />
                  <Route path="/sign-up" element={<AuthenticatedSignUp />} />
                  <Route path="/log-in" element={<AuthenticatedLogIn />} />
                  <Route
                    path="/forgot-password"
                    element={<AuthenticatedForgotPassword />}
                  />
                  <Route
                    path="/edit-password"
                    element={<AuthenticatedEditPassword />}
                  />
                  <Route path="/courses" element={<AuthenticatedCourses />} />
                  <Route
                    path="/my-courses"
                    element={<AuthenticatedUserCourses />}
                  />
                  <Route
                    path="/new-course"
                    element={<AuthenticatedCourseForm action="create" />}
                  />
                  <Route path="/course/:id" element={<AuthenticatedCourse />} />
                  <Route
                    path="/course/:courseId/new-lesson"
                    element={<AuthenticatedLessonForm action="create" />}
                  />
                  <Route
                    path="/course/:courseId/lesson/:id"
                    element={<AuthenticatedLesson />}
                  />
                  <Route path="/lesson/:id" element={<AuthenticatedLesson />} />
                  <Route path="/me" element={<AuthenticatedProfile />} />
                  <Route
                    path="/edit-profile"
                    element={<AuthenticatedEditProfileAndRegistration />}
                  />
                  <Route
                    path="/cancel-account"
                    element={<AuthenticatedCancelAccount />}
                  />
                  <Route
                    path="/my-invitations"
                    element={<AuthenticatedInvitations />}
                  />
                  <Route
                    path="/my-assignments"
                    element={<AuthenticatedUserAllAssignmentSubmissions />}
                  />
                  <Route
                    path="/assignment/:assignmentId/new"
                    element={
                      <AuthenticatedAssignmentSubmissionForm action="create" />
                    }
                  />
                  <Route
                    path="/assignment/:assignmentId/submissions"
                    element={<AuthenticatedAssignmentSubmissions />}
                  />
                  <Route
                    path="/assignment/:id"
                    element={<AuthenticatedAssignmentSubmission />}
                  />
                  <Route
                    path="/my-messages"
                    element={<AuthenticatedMessages />}
                  />
                  <Route
                    path="/new-message"
                    element={<AuthenticatedMessageForm />}
                  />
                  <Route
                    path="/:postableType/:postableId/post/:id"
                    element={<AuthenticatedPost />}
                  />
                </Routes>
              </main>
              {popUp}
            </UserContext.Provider>
          </MessageContext.Provider>
        </PopUpContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
