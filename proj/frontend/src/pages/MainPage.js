import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import moviePoster4 from '../assets/movie4.jpg';
import useUserData from '../hook/useUserData';

const { Search } = Input;

const MainPage = () => {
  const [movies, setMovies] = useState([]);
  const user = useUserData();
  const [mostLikes, setMostLikes] = useState(true);

  useEffect(() => {
    if (!user) return; // If user is not available, do nothing
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/entity/mostLikes/Movie`);
      setMovies(response.data.entitiesWithMostLikesDifference);
      setMostLikes(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onSearch = async (value) => {
    try {
      if(value){
        const response = await axios.get(`http://localhost:3000/movies/search/${encodeURIComponent(value)}`);
        setMovies(response.data);
        setMostLikes(false);
      }
      else {
        fetchData();
      }

    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  return (
    <BaseLayout>
      <Search placeholder="search for movies" onSearch={onSearch} style={{ width: 400, marginLeft: 50 }} />
      <h2 style={{ display: 'flex', justifyContent: 'center', color: '#39535c' }}>{mostLikes ? 'Movies most liked' : 'Results'}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map(movie => (
          <Link to={`/movie/${encodeURIComponent(movie._id)}`} key={movie._id}>
            <Card
              style={{ width: 215, margin: '1.5em', marginBottom: '1em' }}
              cover={<img alt="poster" src={moviePoster4} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              hoverable>
              <div >
                <h4 style={{ margin: '0 0 0.5em 0' }}>{movie.title}</h4>
                <p style={{ margin: '0' }}>{movie.runtime} minutes</p>
                <p style={{ margin: '0' }}>{movie.genre} </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </BaseLayout>
  );
};
export default MainPage;
