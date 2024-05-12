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
import Timeline from './pages/Timeline';
import RecommendationsPage from './pages/RecommendationsPage';
import PermissionDenied from './pages/PermissionDenied';


const App = () => {
  const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    return user ? children : <Navigate to="/permission-denied" />;
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
        <Route path="/movie/:movieId" element={<PrivateRoute><MoviePage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/person/:personId" element={<PrivateRoute><PersonPage /></PrivateRoute>} />
        <Route path="/users/:userId" element={<UserPage />} />
        <Route path="/people" element={<PrivateRoute><PeopleMainPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UsersMainPage /></PrivateRoute>} />
        <Route path="/timeline" element={<PrivateRoute><Timeline /></PrivateRoute>} />
        <Route path="/recommendations" element={<PrivateRoute><RecommendationsPage /></PrivateRoute>} />
        <Route path="/permission-denied" element={<PermissionDenied />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
};

export default App;
