import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Card, Typography, Divider, Button, Descriptions, Tabs, List } from 'antd';
import BaseLayout from '../components/BaseLayout';
import useUserData from '../hook/useUserData';
const { TabPane } = Tabs;

const { Text } = Typography;

function UserPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [userFollow, setUserFollow] = useState(false);

  const user = useUserData();

  let { userId } = useParams();


  useEffect(() => {
    if (!user) return; // If user is not available, do nothing
    userId = "users/" + userId

    async function fetchUserDetails() {
      try {
        const responseUser = await axios.get(`http://localhost:3000/user/${encodeURIComponent(userId)}`);
        setUserInfo(responseUser.data.user);
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    }

    async function fetchFollows() {
      try {
        const responseFollowers = await axios.get(`http://localhost:3000/user/followers/${encodeURIComponent(userId)}`);
        setFollowers(responseFollowers.data.followers);
        const responseFollowing = await axios.get(`http://localhost:3000/user/following/${encodeURIComponent(userId)}`);
        setFollowing(responseFollowing.data.following);

        const userFollows = responseFollowers.data.followers.some(follower => follower.email === user.email);
        setUserFollow(userFollows);

      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    }

    fetchFollows();
    fetchUserDetails();

  }, [user, userId]);



  const handleFollow = async () => {
    userId = "users/" + userId

    try {
      if (userFollow) {
        await axios.delete(`http://localhost:3000/user/unfollow`, { data: { userId: userInfo._id, followerId: user.id } });
      } else {
        await axios.post(`http://localhost:3000/user/follow`, { userId: userInfo._id, followerId: user.id });
      }
      const responseFollowers = await axios.get(`http://localhost:3000/user/followers/${encodeURIComponent(userId)}`);
      setFollowers(responseFollowers.data.followers);
      setUserFollow(!userFollow);
    } catch (error) {
      console.error('Failed to follow/unfollow user', error);
    }
  };

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
                <Descriptions.Item label="Followers">{followers ? followers.length : 0}</Descriptions.Item>
                <Descriptions.Item label="Following">{following ? following.length : 0}</Descriptions.Item>
            </Descriptions>
              {user && user.id !== "users/" + userId && ( // Only show the button if user is logged in and viewing another user's profile
                <Button className={userFollow ? "button" : null} type={userFollow ? "primary" : null} onClick={handleFollow}>
                  {userFollow ? 'Following' : 'Follow'}
                </Button>
              )}
              {user && user.id === "users/" + userId && ( // Show logout button if user is viewing their own profile
                <Link to="/logout"><Button className="button" type="primary">Logout</Button></Link>
              )}
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
