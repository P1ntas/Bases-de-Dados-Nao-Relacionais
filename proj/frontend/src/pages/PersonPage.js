import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Typography, Spin, Alert, List } from 'antd';
import BaseLayout from '../components/BaseLayout';
import useUserData from '../hook/useUserData';

import '../styles/PersonPage.css';

const { Title, Paragraph } = Typography;

function PersonProfile() {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acted_movies, setActedMovies] = useState(null);
  const [directed_movies, setDirectedMovies] = useState(null);
  const { personId } = useParams();
  const user = useUserData();

  useEffect(() => {
    if (!user) return; // If user is not available, do nothing

    async function fetchData() {
      try {
        const personResponse = await axios.get(`http://localhost:3000/person/${encodeURIComponent(personId)}`);
        setPerson(personResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch person:', error);
      }

      try {
        const actedMoviesResponse = await axios.get(`http://localhost:3000/person/${encodeURIComponent(personId)}/acted_movies`);
        setActedMovies(actedMoviesResponse.data);
      } catch (error) {
        console.error('Failed to fetch acted movies:', error);
      }

      try {
        const directedMoviesResponse = await axios.get(`http://localhost:3000/person/${encodeURIComponent(personId)}/directed_movies`);
        setDirectedMovies(directedMoviesResponse.data);
      } catch (error) {
        console.error('Failed to fetch directed movies:', error);
      }
    }

    fetchData();
  }, [user, personId]);
  

  if (loading) {
    return (
      <BaseLayout>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      {person ? (
        <div className="person-profile-container">
          <div className="person-details">
            <Title level={2} className="person-name">{person.name}</Title>
            <Paragraph className="person-biography">{person.biography}</Paragraph>
            <div className="person-info">
              <strong>Birthday:</strong> {new Date(parseInt(person.birthday)).toDateString()}
            </div>
            <div className="person-info">
              <strong>Birthplace:</strong> {person.birthplace}
            </div>
          </div>
        </div>
      ) : (
        <Alert message="Person not found" type="error" />
      )}
      {acted_movies && acted_movies.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={3}>Acted In</Title>
          <List
            bordered
            dataSource={acted_movies}
            renderItem={movie => (
              <List.Item>
                <Link to={`/movie/${encodeURIComponent(movie._id)}`}>{movie.label}</Link>
              </List.Item>
            )}
          />
        </div>
      )}
      {directed_movies && directed_movies.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={3}>Directed</Title>
          <List
            bordered
            dataSource={directed_movies}
            renderItem={movie => (
              <List.Item>
                <Link to={`/movie/${encodeURIComponent(movie._id)}`}>{movie.label}</Link>
              </List.Item>
            )}
          />
        </div>
      )}
    </BaseLayout>
  );
}

export default PersonProfile;
