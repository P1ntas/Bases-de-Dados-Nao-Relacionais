import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MoviePage() {
  const [movie, setMovie] = useState(null);
  const { movieId } = useParams();

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await axios.get(`/movie/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Failed to fetch movie:', error);
      }
    }

    fetchMovie();
  }, [movieId]);

  return (
    <div>

    </div>
  );
}

export default MoviePage;
