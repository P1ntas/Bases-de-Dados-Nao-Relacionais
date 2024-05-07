import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Divider, Button, Tabs } from 'antd';
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
                  <Title level={4}>{user.name}</Title>
                
                  <Text>{user.username}</Text>
                </div>
              </div>
              <Divider />
              <div style={{ marginBottom: '20px' }}>
                <Title level={5}>Contact Information</Title>
                <Text>Email: {user.email}</Text>
              </div>
              <Button className="button" type="primary" onClick={handleLogout}>Logout</Button>
              <Divider />
              <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Tab 1',
                    key: '1',
                    children: 'Tab 1',
                },
                {
                    label: 'Followers',
                    key: 'Followers',
                    children: 'Followers',
                },
                {
                    label: 'Following',
                    key: 'Following',
                    children: 'Following',
                },
                ]}
            />
            </>
          ) : (
            <div>
              <Text>Please log in to view your profile.</Text>
              <Link to="/login"><Button className="button" type="primary" style={{ marginLeft: '10px' }}>Login</Button></Link>
            </div>
          )}
        </Card>
      </div>
    </BaseLayout>
  );
};

export default ProfilePage;
