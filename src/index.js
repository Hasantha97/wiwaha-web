import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Redirect } from 'react-router-dom';
import './index.css';
import App from './App';
import Feed from '@Components/Feed';
import SignIn from '@Components/SignIn';
import Profile from '@Components/Profile';
import NewUser from '@Components/NewUser';
import DeleteUser from '@Components/DeleteUser';
import About from '@Components/About'

const NotFound = () => {
    return (
      <p>404</p>
    )
}

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} >
        <Route index element={<Feed />} />
        <Route path="profile/:uid" element={<Profile/>} />
        <Route path="signin" element={<SignIn />} />
        <Route path="setup/:uid" element={<NewUser />} />
        <Route path="delete" element={<DeleteUser />} />
        <Route path="about" element={<About />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

