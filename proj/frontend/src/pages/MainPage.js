import React, { useState, useEffect } from 'react';
import { theme, Card } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import moviePoster1 from '../assets/movie1.jpg';
import moviePoster2 from '../assets/movie2.jpg';
import moviePoster3 from '../assets/movie3.jpg';
import moviePoster4 from '../assets/movie4.jpg';
import moviePoster5 from '../assets/movie5.jpg';
import moviePoster6 from '../assets/movie6.jpg';
import moviePoster7 from '../assets/movie7.jpg';
import moviePoster8 from '../assets/movie8.jpg';
import moviePoster9 from '../assets/movie9.jpg';


const MainPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData()

  }, []);


  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomPoster = () => {
    const posters = [moviePoster1, moviePoster2, moviePoster3, moviePoster4, moviePoster5, moviePoster6, moviePoster7, moviePoster8, moviePoster9];
    const randomIndex = getRandomInt(0, posters.length - 1);
    return posters[randomIndex];
  };

  return (
    <BaseLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map(movie => (
          <Link to={`/movie/${encodeURIComponent(movie._id)}`} key={movie._id}>
            <Card
              style={{ width: 215,margin: '1.5em', marginBottom: '1em' }}
              cover={<img alt="poster" src={getRandomPoster()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              hoverable>
              <h4>{movie.title}</h4>
              <p>{movie.runtime} minutes</p>
          </Card>
          </Link>
        ))}
      </div>
  </BaseLayout>

  );
};
export default MainPage;