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

function App() {
  const [popUp, setPopUp] = useState(null);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const response = await fetcher('current_user');
      const data = await response.json();
      setUser(data);
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
