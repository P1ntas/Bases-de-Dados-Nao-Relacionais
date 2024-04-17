import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import { Alert, Input, Button } from 'antd';
import ReactPlayer from 'react-player'

function MoviePage() {
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { movieId } = useParams();

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const responseMovie = await axios.get(`http://localhost:3000/movies/${encodeURIComponent(movieId)}`);
        setMovie(responseMovie.data);
      } catch (error) {
        console.error('Failed to fetch movie:', error);
      }

      try {
        const responseComments = await axios.get(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/comment`);
        setComments(responseComments.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    }
    fetchMovieDetails();
  }, [movieId]);


  const [actors, setActors] = useState(null);

  useEffect(() => {
    async function fetchActors() {
      try {
        const response = await axios.get(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/actors`);
        setActors(response.data);
      } catch (error) {
        console.error('Failed to fetch actors:', error);
      }
    }
    fetchActors();
  }, [movieId]);

  const handleSubmit = async () => {
    const payload = {
      _from: "Users/15029", 
      _to: `${movieId}`,
      content: newComment,
      timestamp: new Date().toISOString(),
      $label: "comments"
    };
    console.log('Payload:', payload);

    try {
      axios.post(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/comment`, payload)
  .then(response => console.log('Success:', response))
  .catch(error => console.error('Axios error:', error));

      setComments(prevComments => [...prevComments, { ...payload, _id: `new_${Date.now()}` }]); 
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };


  return (
    <BaseLayout>
      {movie ? (
        <>
          <h1>{movie.title}</h1>
          <h3>{movie.tagline ? movie.tagline : ''}</h3>
          <p>Card content</p>
          <p>Runtime: {movie.runtime} minutes</p>
          <p>Description: {movie.description}</p>
          <ReactPlayer url={movie.trailer} />


        </>
      ) : (
        <Alert message="Movie not found" type="error" />
      )}
      {actors && actors.length > 0 ? (
        <>
          {actors.map(actor => (
            <h1 key={actor._id}>{actor.name}</h1>
          ))}
        </>
      ) : (
        <Alert message="Actors not found" type="error" />
      )}

      {/* TODO: Add comments */}

      {comments && comments.length > 0 ? (
          <>
          {comments.map(com => (
            <h1 key={com._id}>{com.content}</h1>
          ))}
        </>
      ) : (
        <Alert message="Comments not found" type="error" />
      )}

      <div>
        <Input.TextArea
          value={newComment}
          placeholder="Write a comment..."
          onChange={e => setNewComment(e.target.value)}
        />
        <Button type="primary" style={{ marginTop: 10 }} onClick={handleSubmit}>
          Submit Comment
        </Button>
      </div>

    </BaseLayout>
  );
}

export default MoviePage;
