import 'antd/dist/antd.min.css'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header';
import Feedback from './pages/Feedback';
import AvailTour from './pages/AvailTour';
import FoodStatus from './pages/FoodStatus';
import BookRooms from './pages/BookRooms';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Auth } from "aws-amplify";
import { Kitchen } from './pages/Kitchen';
import {FetchDyanamoDB} from './pages/FetchDynamoDB';
import Visuals from './pages/visuals';
import Report from './pages/Report';

function App() {

  const [state, setState] = useState({
    isAuthenticated: false,
    // isAuthenticating: true,
    user: null,
  });

  const setAuthStatus = (authenticated) => {
    setState({ ...state, isAuthenticated: authenticated });
  };
  // useEffect(() => {
  //   console.log(state.isAuthenticated);
  // });

  const setUser = (user) => {
    setState({ ...state, user: user });
  };

  const authProps = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    setAuthStatus: setAuthStatus,
    setUser: setUser,
  };

  useEffect(() => {
    async function fetchSession() {
      try {
        const session = await Auth.currentSession();
        setAuthStatus(true);
        console.log(session);
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
      } catch (error) {
        if (error !== "No current user") {
          console.log(error);
        }
      }
    }
    fetchSession();
    // setState({ isAuthenticating: false });
  }, []);

  return (
    <>
        <Router>
          <Header className='container' user = {state} setUser={setState} auth={authProps} />
          <Routes>
            <Route path="/" element={<Dashboard user = {state} setUser = {setState} auth={authProps}/>} />
            <Route path="/login" element={<Login user = {state} setUser = {setState} auth={authProps} />} />
            <Route path="/register" element={<Register user = {state} setUser = {setState} auth={authProps} />} />
            <Route path="/feedback" element={<Feedback  user = {state} setUser = {setState} auth={authProps} />} />
            <Route path="/AvailTour" element={<AvailTour user = {state} setUser = {setState} auth={authProps}/>} />
            <Route path="/ShowVisuals" element={<Visuals />} />
            <Route path="/FoodStatus" element={<FoodStatus />} />
            <Route path="/BookRooms" element={<BookRooms user = {state} setUser = {setState} auth={authProps}/>} />
            <Route path="/kitchen" element={<Kitchen user = {state} setUser = {setState} auth={authProps} />} />
            <Route path="/dynamo" element={<FetchDyanamoDB user = {state} setUser = {setUser} auth={authProps}/>} />
            <Route path="/report" element={<Report user = {state} setUser = {setState} auth={authProps} />} />
          </Routes>
        </Router>
    </>
  );
}

export default App;