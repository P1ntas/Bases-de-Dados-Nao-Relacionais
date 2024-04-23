import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Alert, Input, Button, List, Typography, Empty } from 'antd';
import { LikeOutlined, LikeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import BaseLayout from '../components/BaseLayout';

const { Title, Text } = Typography;

function MoviePage() {
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [actors, setActors] = useState(null);
  const [directors, setDirectors] = useState(null);
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

    axios.get(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/actors`)
      .then(response => setActors(response.data))
      .catch(error => console.error('Failed to fetch actors:', error));
    
    axios.get(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/directors`)
      .then(response => setDirectors(response.data))
      .catch(error => console.error('Failed to fetch directors:', error));

    axios.get(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/like`)
      .then(response => setIsFavorite(response.data === 1))
      .catch(error => console.error('Failed to fetch like status:', error));
  }, [movieId]);

  const handleSubmit = async () => {
    const payload = {
      _from: "Users/15029",
      _to: `${movieId}`,
      content: newComment,
      timestamp: new Date().toISOString(),
      $label: "comments"
    };

    try {
      await axios.post(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/comment`, payload);
      setComments(prevComments => [...prevComments, { ...payload, _id: `new_${Date.now()}` }]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleLike = () => {
    const newLikeStatus = isFavorite ? 0 : 1;
    axios.post(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/like`, { like: newLikeStatus })
      .then(() => setIsFavorite(newLikeStatus === 1))
      .catch(error => console.error('Failed to update like status:', error));
  };

  return (
    <BaseLayout>
      {movie ? (
        <>
          <Title level={2}>{movie.title}</Title>
          <Text type="secondary">{movie.tagline}</Text>
          <div style={{ marginBottom: 16 }}>
            {isFavorite ? (
              <LikeTwoTone style={{ fontSize: 24, cursor: 'pointer', marginLeft: 8 }} onClick={handleLike} />
            ) : (
              <LikeOutlined style={{ fontSize: 24, color: 'lightgrey', cursor: 'pointer', marginLeft: 8 }} onClick={handleLike} />
            )}
          </div>
          <Text>Runtime: {movie.runtime} minutes</Text><br />
          <Text>Description: {movie.description}</Text><br /><br />
          <ReactPlayer url={movie.trailer} />
        </>
      ) : (
        <Alert message="Movie not found" type="error" />
      )}

      {directors && directors.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={3}>Directed by</Title>
          <List
            bordered
            dataSource={directors}
            renderItem={director => (
              <List.Item>
                <Link to={`/person/${encodeURIComponent(director._id)}`}>{director.name}</Link>
              </List.Item>
            )}
          />
        </div>
      )}

      {actors && actors.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={3}>Actors</Title>
          <List
            bordered
            dataSource={actors}
            renderItem={actor => (
              <List.Item>
                <Link to={`/person/${encodeURIComponent(actor._id)}`}>{actor.name}</Link>
              </List.Item>
            )}
          />
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Title level={3}>Comments</Title>
        {comments && comments.length > 0 ? (
          <List
            dataSource={comments}
            renderItem={comment => (
              <List.Item key={comment._id}>{comment.content}</List.Item>
            )}
          />
        ) : (
          <Empty description="No comments yet" />
        )}
        <Input.TextArea
          value={newComment}
          placeholder="Write a comment..."
          onChange={e => setNewComment(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <Button type="primary" style={{ marginTop: 8 }} onClick={handleSubmit}>Submit Comment</Button>
      </div>
    </BaseLayout>
  );
}

export default MoviePage;
