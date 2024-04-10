import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MoviePage from './pages/MoviePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/movie/:movieId" element={<MoviePage />} />

      </Routes>
    </Router>
  );
};

export default App;
