import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Alert, Input, Button, List, Typography, Empty, Avatar } from 'antd';
import { LikeOutlined, LikeTwoTone, DislikeOutlined, DislikeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import BaseLayout from '../components/BaseLayout';

const { Title, Text } = Typography;

function MoviePage() {
  const [movie, setMovie] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [actors, setActors] = useState(null);
  const [directors, setDirectors] = useState(null);
  const [genre, setGenre] = useState(null);
  const [videoError, setVideoError] = useState(false);

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
        console.log(responseComments.data)
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
      .then(response => setIsLiked(response.data === 1))
      .catch(error => console.error('Failed to fetch like status:', error));

    axios.get(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/genre`)
      .then(response => setGenre(response.data))
      .catch(error => console.error('Failed to fetch genres:', error));
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
    const newLikeStatus = isLiked ? 0 : 1;
    axios.post(`http://localhost:3000/movies/${encodeURIComponent(movieId)}/like`, { like: newLikeStatus })
      .then(() => setIsLiked(newLikeStatus === 1))
      .catch(error => console.error('Failed to update like status:', error));
  };
  
  const handleVideoError = () => {
    setVideoError(true); // Set video error state to true
  };

  return (
    <BaseLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {movie ? (
          <>
            <Title level={1} style={{ margin: 0 }}>{movie.title}</Title>
            <Text type="secondary" style={{ marginBottom: 20 }}>{movie.tagline}</Text>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f0f0f0', borderRadius: 20, padding: '6px 15px' }}>
                {isLiked ? (
                  <>
                    <LikeTwoTone style={{ fontSize: 20, cursor: 'pointer' }} onClick={handleLike} />
                    <div style={{ borderLeft: '1px solid lightgrey', height: 18, margin: '0 12px' }}></div>
                    <DislikeOutlined style={{ fontSize: 20,  color: 'grey', cursor: 'pointer' }} onClick={handleLike} />
                  </>
                ) : (
                  <>
                    <LikeOutlined style={{ fontSize: 20, color: 'grey', cursor: 'pointer' }} onClick={handleLike} />
                    <div style={{ borderLeft: '1px solid lightgrey', height: 18, margin: '0 12px' }}></div>
                    <DislikeTwoTone style={{ fontSize: 20, cursor: 'pointer' }} onClick={handleLike} />
                  </>
                )}
              </div>
            </div>
            <Text>Runtime: {movie.runtime} minutes</Text><br />
            <Text>Description: {movie.description}</Text><br /><br />
            {!videoError && (
              <ReactPlayer
                url={movie.trailer}
                onError={handleVideoError}
              />
            )}
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
            <Title level={3}>Cast</Title>
            <div style={{ maxHeight: 250, overflowY: 'auto', border: '0.5px solid #ddd', borderRadius: 9 }}>
              <List
                dataSource={actors}
                renderItem={actor => (
                  <List.Item style={{ padding: '0.8em 2em' }}>
                    <Link to={`/person/${encodeURIComponent(actor._id)}`}>{actor.name}</Link>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}


        <div style={{ marginTop: 24 }}>
          <Title level={3}>Comments</Title>
          {comments && comments.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(comment, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                    title={<a href="https://ant.design">{comment._from}</a>}
                    description={comment.content}
                  />
                  <div>{comment.timestamp}</div>
                </List.Item>
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
      </div>
    </BaseLayout>
  );
}

export default MoviePage;
