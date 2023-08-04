import React, { memo, useContext, useEffect } from 'react';
import logo from '@Assets/logo.png';
import { Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router';
import MainMenu from './MainMenu';
import "./Header.css";
import { AuthContext } from '@Context/AuthContext';

function Header(props) {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    function logoClickHandle() {
        navigate('/');
    }

    function dpClickHandle() {
        if (user) {
            navigate(`/profile/${user.uid}`);
        } else {
            navigate(`/signin`);
        }
    }

    return (
        <div className="header">
             <div className="header__left">
                <img src={logo} alt="logo" onClick={logoClickHandle} />
                <div className="header__input">     
                    <SearchIcon  />
                    <input placeholder='Coming soon!' type="text" disabled/>
                </div>
            </div> 
            <div className="header__right">
                <Avatar 
                    sx={{
                        border: '1px solid grey'
                    }} 
                    src={user && user.photoURL} 
                    onClick={dpClickHandle} 
                />
                <MainMenu />
            </div> 
         </div>
    );
}

export default memo(Header);
