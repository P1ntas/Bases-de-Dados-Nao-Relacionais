import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';

const { Search } = Input;

const MainPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onSearch = async (value) => {
    console.log(value)
    try {
      if(value){
        const response = await axios.get(`http://localhost:3000/user/search/${encodeURIComponent(value)}`);
        setUsers(response.data);
      }
      else {
        const response = await axios.get('http://localhost:3000/user');
        setUsers(response.data);
      }

    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };


  return (
    <BaseLayout>
      <Search placeholder="input search text" onSearch={onSearch} style={{ width: 400, marginLeft: 50 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {users.map(user => (
          <Link to={`/users/${user._id.replace("Users/", "")}`} key={user._id}>
            <Card
              style={{ width: 215, margin: '1.5em', marginBottom: '1em' }}
              hoverable>
              <h4>{user.name}</h4>
            </Card>
          </Link>
        ))}
      </div>
    </BaseLayout>
  );
};
export default MainPage;
