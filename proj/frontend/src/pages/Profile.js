import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Avatar, Typography, Divider, Button, Tabs, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import useUserData from '../hook/useUserData';
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useUserData();
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    if (!user) return; // If user is not available, do nothing

    async function fetchFollows() {
      try {
        const responseFollowers = await axios.get(`http://localhost:3000/user/followers/${encodeURIComponent(user.id)}`);
        setFollowers(responseFollowers.data.followers);
        const responseFollowing = await axios.get(`http://localhost:3000/user/following/${encodeURIComponent(user.id)}`);
        setFollowing(responseFollowing.data.following);
        console.log(responseFollowers)

      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    }

    fetchFollows();

  }, [user]);


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
              <Tabs defaultActiveKey="1">
                <TabPane tab="Tab 1" key="1">Tab 1 content</TabPane>
                <TabPane tab="Followers" key="Followers">
                  {followers && (
                    <List
                    bordered
                    dataSource={followers}
                    renderItem={follower => (
                      <List.Item>
                        <Link to={`/${follower._id}`}>{follower.name}</Link>
                      </List.Item>
                    )}
                  />
                  )}
                </TabPane>
                <TabPane tab="Following" key="Following">
                  {following && (
                      <List
                      bordered
                      dataSource={following}
                      renderItem={follow => (
                        <List.Item>
                          <Link to={`/${follow._id}`}>{follow.name}</Link>
                        </List.Item>
                      )}
                    />
                    )}
                </TabPane>
              </Tabs>
            </>
          ) : (
            <div>
              <Text>Please log in to view your profile</Text>
              <Link to="/login"><Button className="button" type="primary" style={{ marginLeft: '10px' }}>Login</Button></Link>
            </div>
          )}
        </Card>
      </div>
    </BaseLayout>
  );
};

export default ProfilePage;
