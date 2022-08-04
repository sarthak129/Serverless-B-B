import Style from './index.css'
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Button, Input, Spin, Typography, message } from "antd";
import { Auth } from 'aws-amplify';
import { CEASER_CIPHER, GET_SECURITY_QUESTION } from '../api/Api';

const { Title, Text } = Typography;

const Login = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginStage,setLoginStage] = useState('')
  const [quetAns,setQueAns] = useState({
      cipher: null,
      question: null,
      answer: null
  })
  const [answer,setAnswer] = useState('');
  const [randomString,setRandomString] = useState('');
  const [encodedString, setEndcodedString] = useState('');

  const navigate = useNavigate();

  const { email, password } = formData;

  const dataHandle = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const answerHandle = (e) => {
    setAnswer(e.target.value)
  }

  const handleEncodedString = (e) => {
    setEndcodedString(e.target.value)
  }

  const onSubmitWithLogin = async (e) => {
    try {
      const user = await Auth.signIn(email, password);
      props.auth.setAuthStatus(true);
      props.auth.setUser(user);
      setLoginStage('withsecurity')
      message.success("Authenticated Successufully with Email");


      var data = JSON.stringify({
        "username": user.username
      });

      var config = {
        method: 'post',
        url: GET_SECURITY_QUESTION,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };


      axios(config)
        .then(function (response) {
          setQueAns(response.data)
        })
        .catch(function (error) {
          console.log(error.message);
        });


    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  }

  const onSubmitWithSecurity = async () => {
      if(answer === quetAns.answer){
         message.success("Authenticated Successufully with Security Questions");

         function randomString() {
          var result           = '';
          var characters       = 'abcdefghijklmnopqrstuvwxyz';
          var charactersLength = characters.length;
          for ( var i = 0; i < 4; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
       charactersLength));
         }
         return result;
      }

         setRandomString(randomString());
        setLoginStage('withcipher')
      }else{
        message.error('authentication failed');
      }
  }

  const onSubmitWithCipher = () => {
    if (encodedString != '') {
      
      var data = JSON.stringify({
        "rawText": randomString,
        "cipher":  parseInt(quetAns.cipher),
        "encryptedText": encodedString
      });
      
      var config = {
        method: 'post',
        url: CEASER_CIPHER,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        if(response.data.statusCode === 200){
          message.success("Authenticated Successufully with Ceaser Cipher");
          var data = JSON.stringify({
            "username": formData.email
          });
          
          var config = {
            method: 'post',
            url: 'https://us-central1-csci-5408-w22-340718.cloudfunctions.net/userActivity',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
          

          navigate('/')
        }else{
          message.error('authentication failed');
        }
      })
      .catch(function (error) {
        message.error('authentication failed');
      });
      

    }else{
      message.error('authentication failed')
    }
  }

  const logInWithEmail = () => {
    return(
      <section className="form">
        <Input.Group size="large">
            <Input
              style={{marginTop:'2%'}}
              type="type"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your username"
              onChange={dataHandle}
            />
            <Input
              style={{marginTop:'2%'}}
              type="type"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={dataHandle}
            />
          </ Input.Group>
          <div className='form-group'>
            <Button type='primary' style={{marginTop:'2%'}} className='section' onClick={onSubmitWithLogin}>Next</Button>
          </div>
      </section>
    )
  }

  const logInWithSecurity = () => {
    return(
    <section className="form">
        <Input.Group size="large">
           <Title level={4} style={{marginTop:'10%'}}>{quetAns.question}</Title>
            <Input
              style={{marginTop:'2%'}}
              type="type"
              className="form-control"
              id="answer"
              name="answer"
              value={answer}
              placeholder="Enter security answer"
              onChange={answerHandle}
            />
          </ Input.Group>
          <div className='form-group'>
            <Button type='primary' style={{marginTop:'2%'}} className='section' onClick={onSubmitWithSecurity}> Next </Button>
          </div>
      </section>
    )
  }

  const logInWithCipher = () => {
    return(
      <section className="form">
      <Input.Group size="large">
         <Title level={4} style={{marginTop:'10%'}}>{randomString}</Title>
          <Input
            style={{marginTop:'2%'}}
            type="type"
            className="form-control"
            id="encodedString"
            name="encodedString"
            value={encodedString}
            placeholder="Enter your encoded string with unique cipher key"
            onChange={handleEncodedString}
          />
        </ Input.Group>
        <div className='form-group'>
          <Button type='primary' style={{marginTop:'2%'}} className='section' onClick={onSubmitWithCipher}> Submit </Button>
        </div>
    </section>
    )
  }

  return (
    <section className='section'>
      <section className="section">
        <Title> Log In </Title>
        <Text>Login into account</Text>
      </section>
      {
         loginStage == 'withsecurity' ? logInWithSecurity() : loginStage == 'withcipher' ? logInWithCipher() : logInWithEmail()
      }
    </section>
  );
};

export default Login;
