import React, { useState, useEffect } from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';

const NotFound = () => {
  return (
    <BaseLayout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 9em)' }}>
        <Result
          title="404"
          extra={
            <div>
              <p>Ops, this page does not exist</p>
              <Button key="console">
              <Link to="/">Go back to home page</Link>
              </Button>
            </div>
          }
        />
      </div>
    </BaseLayout>
  );
};

export default NotFound;
