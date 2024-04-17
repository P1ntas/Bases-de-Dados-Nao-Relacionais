import React from 'react';
import { Card, Avatar, Typography, Divider, Button } from 'antd';
import useAuth from '../hooks/useAuth';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Card>
        {auth.username ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Avatar size={64} icon={<UserOutlined />} />
              <div style={{ marginLeft: '20px' }}>
                <Title level={4}>{auth.username}</Title>
              </div>
            </div>
            <Divider />
            <div style={{ marginBottom: '20px' }}>
              <Title level={5}>Contact Information</Title>
              <Text>Email: {auth.email}</Text>
            </div>
            <Divider />
            <Button type="primary" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <div>
            <Text>Please log in to view your profile.</Text>
            <Link to="/login"><Button type="primary" style={{ marginLeft: '10px' }}>Login</Button></Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
