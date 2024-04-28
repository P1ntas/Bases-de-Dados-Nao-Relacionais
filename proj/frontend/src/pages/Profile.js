import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Divider, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import useUserData from '../hook/useUserData';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useUserData();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <BaseLayout>
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <Card>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Avatar size={64} icon={<UserOutlined />} />
                <div style={{ marginLeft: '20px' }}>
                  <Title level={4}>{user.username}</Title>
                </div>
              </div>
              <Divider />
              <div style={{ marginBottom: '20px' }}>
                <Title level={5}>Contact Information</Title>
                <Text>Email: {user.email}</Text>
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
    </BaseLayout>
  );
};

export default ProfilePage;
