import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import useUserData from '../hook/useUserData';


const RecommendationsPage = () => {
  const [people, setPeople] = useState([]);
  const [movies, setMovies] = useState([]);
  const [similarUsers, setSimilarUsers] = useState([]);
  const user = useUserData();

  useEffect(() => {
    if (!user) return; // If user is not available, do nothing
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
        const responseMovies = await axios.get(`http://localhost:3000/entity/recommend/${encodeURIComponent(user.id)}/Movie`);
        console.log(responseMovies.data)
        setMovies(responseMovies.data.recommended);
        setSimilarUsers(responseMovies.data.users)
        const responsePeople = await axios.get(`http://localhost:3000/entity/recommend/${encodeURIComponent(user.id)}/Person`);
        setPeople(responsePeople.data.recommended);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <BaseLayout>
      <h2 style={{ display: 'flex', justifyContent: 'center', color: '#39535c' }}>Recommended movies</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map(movie => (
          <Link to={`/movie/${encodeURIComponent(movie._id)}`} key={movie._id}>
            <Card
              style={{ width: 215, height: 120, margin: '1.5em', marginBottom: '1em' }}
              hoverable>
              <h4>{movie.title}</h4>
            </Card>
          </Link>
        ))}
      </div>

      <h2 style={{ display: 'flex', justifyContent: 'center', color: '#39535c' }}>Recommended people</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {people.map(person => (
          <Link to={`/person/${encodeURIComponent(person._id)}`} key={person._id}>
            <Card
              style={{ width: 215, margin: '1.5em', marginBottom: '1em' }}
              hoverable>
              <h4>{person.name}</h4>
            </Card>
          </Link>
        ))}
      </div>
      <h2 style={{ display: 'flex', justifyContent: 'center', color: '#39535c' }}>Users similar to you</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {similarUsers.map(user => (
          <Link to={`/user/${encodeURIComponent(user._id)}`} key={user._id}>
            <Card
              style={{ width: 215, height: 120, margin: '1.5em', marginBottom: '1em' }}
              hoverable>
              <h4>{user.name}</h4>
            </Card>
          </Link>
        ))}
      </div>
    </BaseLayout>
  );
};
export default RecommendationsPage;
