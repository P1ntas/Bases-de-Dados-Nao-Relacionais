// BaseLayout.js
import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import your logo file


const { Header, Content } = Layout;

const BaseLayout = ({ children }) => {
  const colorBgContainer = '#ffffff'; // Change this to your desired background color

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between', // Align items at the start and end of the header
          alignItems: 'center', // Center items vertically
          backgroundColor: '#39535c',
        }}
      >
        <Link to="/">
          <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '20px' }} />
          </div>
        </Link>
        {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ backgroundColor: '#39535c' }}>
          <Menu.Item key="1">
            <Link to="/movies">Movies</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/people">People</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/timeline">Timeline</Link>
          </Menu.Item>
        </Menu> */}
        <div>
          <Link to={'/profile'}>
            <UserOutlined style={{ color: '#ffffff', fontSize: '1.5em' }} />
          </Link>
        </div>
      </Header>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: colorBgContainer,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default BaseLayout;
