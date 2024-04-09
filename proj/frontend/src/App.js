import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MoviePage from './pages/MoviePage';

const App = () => {

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/movie/:movieId" component={MoviePage} />
      </Switch>
    </Router>
  );
};
export default App;