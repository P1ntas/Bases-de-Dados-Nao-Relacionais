import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Typography, Spin, Alert, Descriptions, List } from 'antd';
import BaseLayout from '../components/BaseLayout';
import useUserData from '../hook/useUserData';

import '../styles/PersonPage.css';

const { Title } = Typography;

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
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {person ? (
          <Descriptions title={person.name}>
            <Descriptions.Item label="Birthday">{person.birthday ? new Date(parseInt(person.birthday)).toDateString(): "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Birthplace">{person.birthplace ? person.birthplace : "N/A"}</Descriptions.Item>
            <br></br>
            <Descriptions.Item label="Biography">{person.biography ? person.biography : "N/A"}</Descriptions.Item>


          </Descriptions>
        ) : (
          <Alert message="Person not found" type="error" />
        )}
        {acted_movies && acted_movies.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={5}>Acted in</Title>
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
            <Title level={5}>Directed</Title>
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
      </div>
      
    </BaseLayout>
  );
}

export default PersonProfile;
