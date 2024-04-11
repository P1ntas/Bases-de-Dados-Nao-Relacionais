import React, { useState, useEffect } from 'react';
import { theme, Card } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';

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



  return (
    <BaseLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map(movie => (
          <Link to={`/movie/${encodeURIComponent(movie._id)}`} key={movie._id}>
            <Card
              hoverable
              title={movie.title} bordered={false} style={{ width: 200, height:200, margin: '10px' }}
            >
              <p>Card content</p>
              <p>{movie.runtime} minutes</p>
            </Card>
          </Link>
        ))}
      </div>
  </BaseLayout>

  );
};
export default MainPage;