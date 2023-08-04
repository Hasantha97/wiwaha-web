import React from 'react';
import styles from "./SignIn.module.css";
import Avatar from '@mui/material/Avatar';
import logo from '@Assets/logo.png';
import { useNavigate } from 'react-router';

import { auth } from '@Utils/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


export default function SignIn() {
    const navigate = useNavigate();

    const uiConfig = {
        signInFlow: 'redirect',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: (authResult) => {
                if (authResult.additionalUserInfo.isNewUser) {
                    navigate(`/setup/${authResult.user.uid}`)
                } else {
                    navigate(`/profile/${authResult.user.uid}`)
                }
            }
        }
    };
    
    return (
        <div className ={styles.signIn}>
            <div className ={styles.logo} >
                <Avatar src={logo} />
            </div>
            <StyledFirebaseAuth className={styles.firebaseUi} uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
    )
}
