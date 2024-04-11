import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import { Alert } from 'antd';
import ReactPlayer from 'react-player'

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
          <>
            <h1>{movie.title}</h1>
            <h3>{movie.tagline ? movie.tagline : ''}</h3>
            <p>Card content</p>
            <p>Runtime: {movie.runtime} minutes</p>
            <p>Description: {movie.description}</p>
            <ReactPlayer url={movie.trailer}/>


          </>
      ) : (
        <Alert message="Movie not found" type="error" />
      )}
    </BaseLayout>
  );
}

export default MoviePage;
