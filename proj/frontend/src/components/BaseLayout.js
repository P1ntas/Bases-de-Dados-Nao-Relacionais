// BaseLayout.js
import React from 'react';
import { Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const BaseLayout = ({ children }) => {
  const colorBgContainer = '#ffffff'; // Change this to your desired background color
  const borderRadiusLG = '5px'; // Change this to your desired border radius

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
        <UserOutlined style={{ color: '#ffffff', fontSize: '1.5em' }} />
      </Header>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
    </Layout>
  );
};

export default BaseLayout;
