import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, theme, Card, Button, ConfigProvider } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
const { Meta } = Card;

const MainPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData()

  }, []);



  return (
    <BaseLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map(movie => (
          <Link to={`/movie/${encodeURIComponent(movie._id)}`} key={movie._id}>
            <Card
              hoverable
              title="Card title" bordered={false} style={{ width: 300 }}
            >
              <Meta title={movie.title} description="www.instagram.com" />
            </Card>
          </Link>
        ))}
      </div>
  </BaseLayout>

  );
};
export default MainPage;