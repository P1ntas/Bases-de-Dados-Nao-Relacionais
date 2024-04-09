import './App.css';
import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, theme, Card, Button, ConfigProvider } from 'antd';
import axios from 'axios';

const { Header, Content, Sider } = Layout;
const MainPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [movies, setMovies] = useState([]);
  const [poster, setPoster] = useState();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/movies');
        console.log(response.data)
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get('https://www.myapifilms.com/imdb/idIMDB?idIMDB=tt0499549&token=ce7119d2-fb30-4d9e-a51e-c87f7357acde');
        setPoster(response.data.data.movies[0].urlPoster)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData()
    fetchImage();

  }, []);

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
      
        }}
        type="primary"
      >
        <div className="demo-logo" />
        <UserOutlined  style={{ color: '#ffffff', fontSize: '1.5em' }}/>

      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >

        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <ul>
              {movies.map(movie => (
                <li key={movie._id}>
                  <h2>{movie.title}</h2>
                  <p>{movie.description}</p>
                  <img src={poster} alt={movie.title} style={{ width: '100px', height: '150px' }}/>
                </li>
              ))}
            </ul>
          </Content>
        </Layout>
      </Layout>
    </Layout>

  );
};
export default MainPage;