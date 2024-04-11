import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    const { username, email } = values;

    try {
      const response = await axios.post('http://localhost:3000/auth/register', values);
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
      console.error('Registration error:', error);
      message.error('Internal server error');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: 300 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 30 }}>Register</Title>
        <Form
          form={form}
          name="register-form"
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please input a valid email address!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
