import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import { MehOutlined } from '@ant-design/icons';

const NotFound = () => {
  return (
    <BaseLayout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 9em)' }}>
        <Result
            icon={<MehOutlined style={{ color: '#39535c'}}/>}
          title="403"
          extra={
            <div>
              <p>Ops, you need to log in to have access to this page</p>
              <Button key="console">
              <Link to="/login">Sign in</Link>
              </Button>
            </div>
          }
        />
      </div>
    </BaseLayout>
  );
};

export default NotFound;
