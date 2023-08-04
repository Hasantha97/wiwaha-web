import React, { useState, useContext } from 'react'
import Menu from '@mui/material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { auth } from '../../utils/firebase';
import { AuthContext } from '../../context/AuthContext';


const SignIn = (props) => {
    const navigate = useNavigate();

    function signInClickHandle() {
        navigate('/signin');
    }

    return (
        <MenuItem onClick={signInClickHandle}>
            <ListItemIcon>
                <LoginIcon fontSize="small" />
            </ListItemIcon>
            Sign In
        </MenuItem>
    )
}


const SignOut = (props) => {
    const navigate = useNavigate();

    function signOutClickHandle() {
        auth.signOut()
        .then(() => {
            navigate('/');
        })
        
    }

    return (
        <MenuItem onClick={signOutClickHandle}>
            <ListItemIcon>
                <LogoutIcon fontSize="medium" />
            </ListItemIcon>
            Sign Out
        </MenuItem>
    )
}


const DeleteAcc = (props) => {
    const navigate = useNavigate();

    function deleteAccClickHandle() {
        navigate('/delete');
    }

    return (
        <MenuItem onClick={deleteAccClickHandle}>
            <ListItemIcon>
                <DeleteIcon fontSize="medium" />
            </ListItemIcon>
            Delete Account
        </MenuItem>
    )
}


export default function MainMenu() {
    const { user } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();


    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };


    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Main Menu">
                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <MenuIcon sx={{ width: 32, height: 32 }}>M</MenuIcon>
                </IconButton>
                </Tooltip>
            </Box>
            
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                        },
                        '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        },
                },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >

                {user 
                    ? 
                        <>
                            <SignOut /> 
                            <DeleteAcc />
                        </>
                    : <SignIn />
                }

                <Divider />
                <MenuItem onClick={() => {navigate('/about')}}>
                    <ListItemIcon>
                        <InfoIcon fontSize="medium" />
                    </ListItemIcon>
                        About
                </MenuItem>
            </Menu>

        </div>
    )
}
