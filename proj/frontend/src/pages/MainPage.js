import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, theme, Card, Button, ConfigProvider } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
const { Meta } = Card;

const MainPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [movies, setMovies] = useState([]);
  const [poster, setPoster] = useState();


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

  useEffect(() => {
    const fetchPosters = async () => {
      const updatedMovies = [];

      for (const movie of movies) {
        try {
          const response = await axios.get(`https://www.myapifilms.com/imdb/idIMDB?idIMDB=${movie.imdbId}&token=ce7119d2-fb30-4d9e-a51e-c87f7357acde`);
          const posterUrl = response.data.data.movies[0].urlPoster;
          updatedMovies.push({ ...movie, posterUrl });
        } catch (error) {
          console.error(`Error fetching poster for movie ${movie.title}:`, error);
          updatedMovies.push(movie);
        }
      }

      setMovies(updatedMovies);
    };

    if (movies.length > 0) {
      //fetchPosters();
    }
  }, [movies]);

  return (
    <BaseLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map(movie => (
          <Link to={`/movie/${encodeURIComponent(movie._id)}`} key={movie._id}>
            <Card
              hoverable
              style={{ width: 200, margin: '12px' }} // Adjusted width and margin
              cover={<img alt={movie.title} src={movie.posterUrl} style={{ height: 280 }} />} // Adjusted image height
            >
              <Meta title={movie.title} description="www.instagram.com" />
            </Card>
          </Link>
        ))}
      </div>
  </BaseLayout>

  );
};
export default MainPage;