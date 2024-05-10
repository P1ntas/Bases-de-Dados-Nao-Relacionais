import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MoviePage from './pages/MoviePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/Profile';
import PersonPage from './pages/PersonPage';
import UserPage from './pages/UserPage';
import PeopleMainPage from './pages/PeopleMainPage';
import UsersMainPage from './pages/UsersMainPage';
import NotFound from './pages/NotFound';
import useUserData from './hook/useUserData';
import PermissionDenied from './pages/PermissionDenied';


const App = () => {
  const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    console.log(user)
    return user ? children : <Navigate to="/permission-denied" />;
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/movie/:movieId" element={<MoviePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/person/:personId" element={<PersonPage />} />
        <Route path="/users/:userId" element={<UserPage />} />
        <Route path="/people" element={<PeopleMainPage />} />
        <Route path="/users" element={<UsersMainPage />} />
        <Route path="/permission-denied" element={<PermissionDenied />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
};

export default App;
