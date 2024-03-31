import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, theme, Card, Button, ConfigProvider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Header, Content, Sider } = Layout;
const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000');
        setData(response.data.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

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
            {data}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;