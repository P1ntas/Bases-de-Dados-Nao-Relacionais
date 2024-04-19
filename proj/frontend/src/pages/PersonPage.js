import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Alert } from 'antd';
import BaseLayout from '../components/BaseLayout';
import '../styles/PersonPage.css';

const { Title, Paragraph } = Typography;

function PersonProfile() {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const { personId } = useParams();

  useEffect(() => {
    async function fetchPerson() {
      try {
        const response = await axios.get(`http://localhost:3000/persons/${encodeURIComponent(personId)}`);
        console.log(response.data);
        setPerson(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch person:', error);
      }
    }
    fetchPerson();
  }, [personId]);

  return (
    <BaseLayout>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
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
        </>
      )}
    </BaseLayout>
  );
}

export default PersonProfile;
