import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import { Alert, Flex, Spin } from 'antd';

function MoviePage() {
  const [movie, setMovie] = useState(null);

  const { movieId } = useParams();

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await axios.get(`http://localhost:3000/movies/${encodeURIComponent(movieId)}`);
        console.log(response.data)
        setMovie(response.data);
      } catch (error) {
        console.error('Failed to fetch movie:', error);
      }
    }
    fetchMovie();
  }, [movieId]);


  return (
    <BaseLayout>
      {movie ? (
          <h2>{movie.title}</h2>
      ) : (
        <Alert message="Movie not found" type="error" />
      )}
    </BaseLayout>
  );
}

export default MoviePage;
