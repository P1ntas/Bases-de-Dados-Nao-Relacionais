// BaseLayout.js
import React from 'react';
import { Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const BaseLayout = ({ children }) => {
  const colorBgContainer = '#ffffff'; // Change this to your desired background color

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#282A3A',
        }}
        type="primary"
      >
        <div className="demo-logo" />
        <Link to={'/profile'}>
          <UserOutlined style={{ color: '#ffffff', fontSize: '1.5em' }} />
        </Link>
      </Header>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer
            }}
          >
            {children}
          </Content>
    </Layout>
  );
};

export default BaseLayout;
