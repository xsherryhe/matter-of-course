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
import NewCourse from './components/NewCourse';
import Course from './components/Course';
import UserCourses from './components/UserCourses';

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

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
                <Route path="/new-course" element={<NewCourse />} />
                <Route path="/course/:id" element={<Course />} />
              </Routes>
            </main>
          </UserContext.Provider>
        </MessageContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
