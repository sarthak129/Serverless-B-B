import './index.css'

import axios from 'axios';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Spin, Typography, Input, Space, Button, Menu, Dropdown, InputNumber, message } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { REGISTER_USER } from '../api/Api';
import { Auth } from 'aws-amplify';

const { Title, Text } = Typography;

const Register = (props) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    emailId: "",
    password: "",
    securityQuestion: "",
    securityAnswer: '',
    cipher: 1
  });

  const [registerProcess, setRegistracterProcess] = useState(false);

  const menuItems = [
    {
      label: 'What is your favorite color?',
      key: '0',
    },
    {
      label: 'what is your favorite movie?',
      key: '1',
    },
    {
      label: 'what is your favorite sport?',
      key: '2',
    },
  ]

  const { username, emailId, password, securityQuestion, securityAnswer, cipher } = formData;

  const dataHandle = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  // const onSubmit = (e) => {
  //   e.preventDefault();

  //   const userData = {
  //     name,
  //     email,
  //     password
  //   }

  //   dispatch(register(userData))
  // }

  const onSubmit = async (e) => {
    if (formData.username || formData.emailId || formData.password || formData.securityQuestion || formData.securityAnswer || formData.cipher) {
      setRegistracterProcess(true)
      try {
        const signUpResponse = await Auth.signUp({
          username: username,
          password: password,
          attributes: {
            email: emailId,
          },
        })
        const data = JSON.stringify(formData);
        var config = {
          method: 'post',
          url: REGISTER_USER,
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
     
      axios(config)
        .then(function (response) {
          message.success('Registration successfully')
        })
        .catch(function (error) {
          message.error('Registreation failed');
        });

      } catch (error) {
        message.error(error.message);
      } finally{
        setRegistracterProcess(false)
      }
    }
  }

  const onClick = ({ key }) => {
    // console.log(menuItems[key]);

    setFormData((prevState) => ({
      ...prevState,
      ['securityQuestion']: menuItems[key].label,
    }))
  };

  const onChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      ['cipher']: value,
    }))
  }

  const menu = (
    <Menu
      onClick={onClick}
      items={menuItems}
    />
  );
  
  return (
    <section className='section'>
      <section className='section' style={{ width: '50%' }}>
        <Title> Register  </Title>
        <Text>Please create an account</Text>
      </section>
      <Space direction="vertical">
        <section className="form">
          <form onSubmit={onSubmit}>
            <Input.Group size="large">
              <Input
                style={{ margin: '2%' }}
                size="large"
                type="type"
                className="form-control"
                id="username"
                name="username"
                value={username}
                placeholder="Enter your username"
                onChange={dataHandle}
              />
              <Input
                style={{ margin: '2%' }}
                size="large"
                type="type"
                className="form-control"
                id="emailId"
                name="emailId"
                value={emailId}
                placeholder="Enter your email"
                onChange={dataHandle}
              />
              <Input
                style={{ margin: '2%' }}
                size="large"
                type="type"
                className="form-control"
                id="password"
                name="password"
                value={password}
                placeholder="Enter password"
                onChange={dataHandle}
              />

              <Dropdown overlay={menu}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space style={{ marginLeft: '2%', marginTop: '2.5%' }}>
                    Select security Question
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
              <div style={{ marginLeft: '2%' }}>
                {securityQuestion
                  ?
                  <>
                    <Text code>{securityQuestion}</Text>
                    <Input
                      style={{ marginTop: '2%' }}
                      size="large"
                      type="type"
                      className="form-control"
                      id="securityAnswer"
                      name="securityAnswer"
                      value={securityAnswer}
                      placeholder="Enter answer"
                      onChange={dataHandle}
                    />
                  </>
                  : null}
              </div>

              <div style={{ marginBottom: '2%' }}>
                <Text strong>Enter unique security number</Text>
                <InputNumber min={1} max={26} defaultValue={1} onChange={onChange} />
              </div>

            </Input.Group>

            <Button className='section' type='primary' onClick={onSubmit} loading={registerProcess}>Submit</Button>
          </form>
        </section>
      </Space>
    </section>
  );
};

export default Register;
