import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Typography, Divider, Button, Descriptions, Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import useUserData from '../hook/useUserData';

const { Title, Text } = Typography;

function UserPage() {
  const [userInfo, setUserInfo] = useState(null);
  const user = useUserData();

  let { userId } = useParams();

  useEffect(() => {
    if (!user) return; // If user is not available, do nothing

    async function fetchUserDetails() {
      try {
        userId = "Users/" + userId
        console.log(userId)
        const responseUser = await axios.get(`http://localhost:3000/user/${encodeURIComponent(userId)}`);
        console.log(responseUser.data)

        setUserInfo(responseUser.data.user);
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }

    }
    fetchUserDetails();

  }, [user, userId]);

  
  
  return (
    <BaseLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
          {userInfo ? (
            <>
            <Descriptions title={userInfo.name}>
                <Descriptions.Item label="Username">{userInfo.username}</Descriptions.Item>
                <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
                <br></br>
                <Descriptions.Item label="Followers">zzzz</Descriptions.Item>
                <Descriptions.Item label="Following">zzzz</Descriptions.Item>
            </Descriptions>
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
}

export default UserPage;
