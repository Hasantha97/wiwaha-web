import React, {useContext, useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import FileSelectBtn from '../FileSelectBtn';
import SaveIcon from '@mui/icons-material/Save';
import styles from "./NewUser.module.css";
import { useParams, useNavigate } from 'react-router';

import {AuthContext} from '@Context/AuthContext';
import { auth } from '../../utils/firebase';
import { updateProfile } from "firebase/auth";

import { storage } from '../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '../../utils/firebase';
import { doc, setDoc } from "firebase/firestore/lite"; 


export default function NewUser(props) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [dpFile, setDpFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const params = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        // console.log('useEffect - newUser');
    }, []);


    function formSubmitHandle(e) {
        e.preventDefault();
        setLoading(true);

        if (user.uid !== params.uid) {
            navigate('/404');
            return;
        }

        const userData = {
            name: e.target.name.value,
            description: e.target.description.value,
            contact: {
                phone: e.target.phone.value,
                email: e.target.email.value,
                website: e.target.website.value,
                address: e.target.address.value
            }
        }

        uploadFiles()
        .then((urls) => {
            addPhotographer(urls, userData)
            .then(() => {
                setTimeout(() => {
                    navigate(`/profile/${user.uid}`)
                }, 500)
            })
        })
        .catch((err) => {
            // console.log(`Error > ${err}`);
            alert('Something went wrong, Try again later.')
            setLoading(false);
        });
    }


    async function uploadFiles() {
        let dpUrl = user ? user.photoURL : '';
        let coverUrl = '';

        if (dpFile) {
            const dpRef = ref(storage, `photographers/${user.uid}/dp.jpg`);
            const dpUploadRes = await uploadBytes(dpRef, dpFile);
            const dpFileUrl = await getDownloadURL(dpRef);

            updateProfile(user, {
                photoURL: dpFileUrl
            });

            dpUrl = dpFileUrl;
        }

        if (coverFile) {
            const coverRef = ref(storage, `photographers/${user.uid}/cover.jpg`);
            const coverUploadRes = await uploadBytes(coverRef, coverFile);
            const coverFileUrl = await getDownloadURL(coverRef);
            coverUrl = coverFileUrl;
        }
        

        return {dpUrl, coverUrl}
    }


    async function addPhotographer(urls, data) {
        await setDoc(doc(db, "photographers", user.uid), {
            name: data.name,
            description: data.description,
            contact: data.contact,
            dp: urls.dpUrl,
            cover: urls.coverUrl
        });
    }


    function dpFileHandle(f) {
        setDpFile(f);
    }


    function coverFileHandle(f) {
        setCoverFile(f)
    }


    if (!user) {
        return null;
    } 


    return (
        <div className={styles.newUser}>
            <div className={styles.welcomWrapper}>
                <h2>{`Welcome, ${user.displayName}!`}</h2>
                <span>Let's setup your profile,</span>
            </div>
            <div className={styles.newProfile}>
                <form onSubmit={formSubmitHandle}>
                    <div className={styles.formInputs}>
                        <TextField 
                            id="name" 
                            label="Profile Name" 
                            defaultValue={user && user.displayName}
                            sx={{backgroundColor: "white"}} 
                            variant="outlined" 
                        />
                        <TextField 
                            id="description" 
                            label="Description" 
                            multiline 
                            minRows='3' 
                            sx={{backgroundColor: "white"}} 
                            variant="outlined"
                        />
                        <TextField 
                            id="phone" 
                            label="Contact Number" 
                            sx={{backgroundColor: "white"}} 
                            variant="outlined" 
                        />            
                        <TextField 
                            id="email" 
                            label="Email" 
                            type="email" 
                            defaultValue={user && user.email}
                            sx={{backgroundColor: "white"}}
                            variant="outlined" 
                        />
                        <TextField 
                            id="website" 
                            label="Website"
                            sx={{backgroundColor: "white"}} 
                            variant="outlined" 
                        />
                        <TextField 
                            id="address" 
                            label="Address" 
                            sx={{backgroundColor: "white"}} 
                            variant="outlined" 
                        />
                        <div className={styles.fileSelectBtnsWrapper}>
                            <FileSelectBtn id="dpSelect" text="Profile Picture" fileHandler={dpFileHandle} />
                            <FileSelectBtn id="coverSelect" text="Cover Photo" fileHandler={coverFileHandle} />
                        </div>
                        <div className = {styles.saveBtnWrapper}>
                            <LoadingButton
                                type='submit'
                                loading={loading}
                                loadingPosition="end"
                                endIcon={<SaveIcon />}
                                variant="contained"
                                fullWidth
                            >
                                Save
                            </LoadingButton>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
