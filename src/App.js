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
import UserAssignmentSubmissions from './components/UserAssignmentSubmissions';
import AssignmentSubmissionForm from './components/AssignmentSubmissionForm';
import AssignmentSubmission from './components/AssignmentSubmission';
import AssignmentSubmissions from './components/AssignmentSubmissions';
import Messages from './components/Messages';
import MessageForm from './components/MessageForm';

function App() {
  const [popUp, setPopUp] = useState(null);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const response = await fetcher('current_user');
      setUser(response.data);
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
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/log-in" element={<LogIn />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/my-courses" element={<UserCourses />} />
                  <Route
                    path="/new-course"
                    element={<CourseForm action="create" />}
                  />
                  <Route path="/course/:id" element={<Course />} />
                  <Route
                    path="/course/:courseId/new-lesson"
                    element={<LessonForm action="create" />}
                  />
                  <Route
                    path="/course/:courseId/lesson/:id"
                    element={<Lesson />}
                  />
                  <Route path="/lesson/:id" element={<Lesson />} />
                  <Route path="/my-invitations" element={<Invitations />} />
                  <Route
                    path="/my-assignments"
                    element={<UserAssignmentSubmissions />}
                  />
                  <Route
                    path="/assignment/:assignmentId/new"
                    element={<AssignmentSubmissionForm action="create" />}
                  />
                  <Route
                    path="/assignment/:assignmentId/submissions"
                    element={<AssignmentSubmissions />}
                  />
                  <Route
                    path="/assignment/:id"
                    element={<AssignmentSubmission />}
                  />
                  <Route path="/my-messages" element={<Messages />} />
                  <Route path="/new-message" element={<MessageForm />} />
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
