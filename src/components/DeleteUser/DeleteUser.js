import React, { useState, useContext }  from 'react';
import styles from "./DeleteUser.module.css";
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

import { auth } from '@Utils/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { doc, deleteDoc } from "firebase/firestore/lite";
import { storage } from '../../utils/firebase';
import { ref, listAll, deleteObject } from "firebase/storage";
import { deleteUser } from "firebase/auth";
import { db } from '../../utils/firebase';

import { AuthContext } from '../../context/AuthContext';

export default function DeleteUser() {
    const { user, authLoading } = useContext(AuthContext);
    const [dialog, setDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => {
                setDialog(true);
            }
        }
    };


    function deleteAccount() {
        setLoading(true);

        deleteDbDoc()
        .then(() => {
            deleteFiles(`photographers/${user.uid}`)
            .then(() => {
                deleteAuthUser()
                .then(() => {
                    setTimeout(() => {
                        navigate('/');
                    }, 1000)
                })
            })
        })
        .catch((err) => {alert('Could not delete account.\nPlease try again later.')})
    }


    async function deleteDbDoc() {
        await deleteDoc(doc(db, "photographers", `${user.uid}`));
    }


    async function deleteFiles(path) {
        const storageRef = ref(storage, path);
        await listAll(storageRef)
        .then((dir) => {
            dir.items.forEach((fileRef) => {
            const newRef = ref(storage, `${storageRef.fullPath}/${fileRef.name}`);
            deleteObject(newRef)
          });
          dir.prefixes.forEach((folderRef) => {
              deleteFiles(folderRef.fullPath)
          })
        });
    }


    async function deleteAuthUser() {
        await deleteUser(auth.currentUser);
    }
    

    function noClickHandle() {
        setDialog(false);
        navigate('/');
    }


    if (authLoading) {
        return null;
    }


    return (
        <div className ={styles.deleteUser}>
            <div className ={styles.titleWrapper} >
                <h2>Delete Account</h2>
                <span>Please sign in again to delete your account</span>
            </div>
            <StyledFirebaseAuth className={styles.firebaseUi} uiConfig={uiConfig} firebaseAuth={auth} />

            <Dialog 
                open={dialog}
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete your account?<br/>
                        This action can not be undone!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        onClick={deleteAccount}
                        loading={loading}
                        loadingPosition="end"
                        color="error"
                        endIcon={<SentimentVeryDissatisfiedIcon/>}
                    >
                        Yes
                    </LoadingButton>
                    <Button onClick={noClickHandle}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

        
    )
}
