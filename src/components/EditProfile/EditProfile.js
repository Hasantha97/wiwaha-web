import React, {useContext, useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import FileSelectBtn from '../FileSelectBtn';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import styles from "./EditProfile.module.css";
import { updateProfile } from "firebase/auth";
import { AuthContext } from '@Context/AuthContext';

import { storage } from '../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '../../utils/firebase';
import { doc, updateDoc } from "firebase/firestore/lite"; 


export default function EditProfile(props) {
    const { user, authLoading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [dpFile, setDpFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    useEffect(() => {
        // console.log('useEffect - editprofile');
        // console.log(user.photoURL);
    }, [])


    function formSubmitHandle(e) {
        e.preventDefault();
        setLoading(true);

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
                    window.location.reload();
                }, 1000)
            })
        })
        .catch((err) => {
            // console.log(`Error > ${err}`);
            alert('Something went wrong, Try again later.')
            setLoading(false);
        });


    }

    async function uploadFiles() {
        let dpUrl = '';
        let coverUrl = '';

        if (dpFile) {
            // console.log('uploading dp..');
            const dpRef = ref(storage, `photographers/${user.uid}/dp.jpg`);
            const dpUploadRes = await uploadBytes(dpRef, dpFile);
            const dpFileUrl = await getDownloadURL(dpRef);

            updateProfile(user, {
                photoURL: dpFileUrl
            });

            dpUrl = dpFileUrl;
        }

        if (coverFile) {
            // console.log('uploading cover..');
            const coverRef = ref(storage, `photographers/${user.uid}/cover.jpg`);
            const coverUploadRes = await uploadBytes(coverRef, coverFile);
            const coverFileUrl = await getDownloadURL(coverRef);
            coverUrl = coverFileUrl;
        }
        

        return {dpUrl, coverUrl}
    }


    async function addPhotographer(urls, data) {

        const finalData = {
            name: data.name,
            description: data.description,
            contact: data.contact,
            dp: urls.dpUrl,
            cover: urls.coverUrl
        }

        // remove empty properties from object
        Object.keys(finalData).forEach((k) => finalData[k] === '' && delete finalData[k]);
        await updateDoc(doc(db, "photographers", user.uid), finalData);
    }



    function dpFileHandle(f) {
        setDpFile(f);
    }

    function coverFileHandle(f) {
        setCoverFile(f)
    }


    if (authLoading) {
        return null;
    }

    return (
        <div className={styles.editProfile}>
            <IconButton 
                className={styles.closeBtn}
                onClick={props.closeHandle} 
                sx={{
                    position: 'absolute',
                    right: '5px',
                    top: '5px'
                }} >
                    <CloseIcon />
            </IconButton>
            <div className ={styles.editProfileTitleWrapper}>
                <EditIcon />
                <span>Edit Profile</span>
            </div>
            <form onSubmit={formSubmitHandle}>
                <div className={styles.formInputs}>
                    <TextField 
                        id="name" 
                        label="Profile Name" 
                        defaultValue={props.photographer.name}
                        sx={{backgroundColor: "white"}} 
                        variant="outlined" 
                    />
                    <TextField 
                        id="description" 
                        label="Description"
                        defaultValue={props.photographer.description}
                        multiline 
                        minRows='3' 
                        sx={{backgroundColor: "white"}} 
                        variant="outlined"
                    />
                    <TextField 
                        id="phone" 
                        label="Contact Number" 
                        defaultValue={props.photographer.contact.phone}
                        sx={{backgroundColor: "white"}} 
                        variant="outlined" 
                    />            
                    <TextField 
                        id="email" 
                        label="Email" 
                        type="email" 
                        defaultValue={props.photographer.contact.email}
                        sx={{backgroundColor: "white"}}
                        variant="outlined" 
                    />
                    <TextField 
                        id="website" 
                        label="Website"
                        defaultValue={props.photographer.contact.website}
                        sx={{backgroundColor: "white"}} 
                        variant="outlined" 
                    />
                    <TextField 
                        id="address" 
                        label="Address" 
                        defaultValue={props.photographer.contact.address}
                        sx={{backgroundColor: "white"}} 
                        variant="outlined" 
                    />
                    <div className={styles.fileSelectBtnsWrapper}>
                        <FileSelectBtn id="dpSelect" text="Profile Picture" fileHandler={dpFileHandle} />
                        <FileSelectBtn id="coverSelect" text="Cover Photo" fileHandler={coverFileHandle} />
                    </div>
                    <div className={styles.saveBtnWrapper}>
                        <LoadingButton
                            type='submit'
                            loading={loading}
                            loadingPosition="end"
                            endIcon={<SaveIcon />}
                            variant="contained"
                            fullWidth
                        >
                            Save Changes
                        </LoadingButton>
                    </div>
                </div>
            </form>
        </div>
    )
}
