import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    const { username, email } = values;

    try {
      const response = await axios.post('http://localhost:3000/auth/login', values);
      if (response.data.success) {
        message.success(response.data.message);
        setAuth({
            username, email
          });
        navigate('/');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Internal server error');
    }
    setLoading(false);
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: 300 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 30 }}>Sign in</Title>
        <Form
          form={form}
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="medium"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
