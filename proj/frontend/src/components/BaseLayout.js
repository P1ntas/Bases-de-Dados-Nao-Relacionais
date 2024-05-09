import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import your logo file

const { Header, Content } = Layout;

const BaseLayout = ({ children }) => {
  const location = useLocation(); // Get current location
  const colorBgContainer = '#ffffff'; // Change this to your desired background color

  // Function to determine the selected key based on the current location
  const getSelectedKey = () => {
    switch (location.pathname) {
      case '/':
        return '1'; 
      case '/people':
        return '2';
      case '/timeline':
        return '3'; 
      default:
        return;
    }
  };

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
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '20px' }} />
            </div>
          </Link>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[getSelectedKey()]} style={{ backgroundColor: '#39535c' }}>
            <Menu.Item key="1">
              <Link to="/">Movies</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/people">People</Link>
            </Menu.Item>
            <Menu.Item key="3" style={{ width: '100px' }}> {/* Adjust the width as needed */}
              <Link to="/timeline">Timeline</Link>
            </Menu.Item>
          </Menu>
        </div>
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
