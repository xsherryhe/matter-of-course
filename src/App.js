import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import fetcher from './fetcher';

import UserContext from './components/contexts/UserContext';
import Header from './components/Header';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Courses from './components/Courses';

function App() {
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
        <UserContext.Provider value={{ user, set: setUser }}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="log-in" element={<LogIn />} />
              <Route path="courses" element={<Courses />} />
            </Routes>
          </main>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
