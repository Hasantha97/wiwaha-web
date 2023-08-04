import React from 'react';
import { useState } from 'react';
import styles from './NewAlbum.module.css';
import TextField from '@mui/material/TextField';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import FileSelectBtn from '../FileSelectBtn';
import PhotoSelectionBox from './PhotoSelectionBox';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router';

import { storage } from '../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '../../utils/firebase';
import { doc, setDoc } from "firebase/firestore/lite"; 

export default function NewAlbum(props) {
    const [loading, setLoading] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [photoFiles, setPhotoFiles] = useState(null);

    const params = useParams();

    function formSubmitHandle(e) {
        e.preventDefault();
        
        const AlbumData = {
            name: e.target.name.value,
            year: e.target.year.value,
        }

        if (AlbumData.name === '') {
            alert('Album name can not be empty!');
            return;
        }

        if (!coverFile) {
            alert('Please select a cover photo for your album!');
            return;
        }

        if (!photoFiles) {
            alert('Please select some photos for your album!');
            return;
        }
        
        setLoading(true);
        uploadFiles()
        .then((res) => {
            addAlbum(res, AlbumData)
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
        let randNum = Date.now().toString();
        let coverUrl = '';
        let photoUrls = {};

        if (coverFile) {
            // console.log('uploading cover..');
            const coverRef = ref(storage, `photographers/${params.uid}/albums/${randNum}/cover.jpg`);
            const coverUploadRes = await uploadBytes(coverRef, coverFile);
            const coverFileUrl = await getDownloadURL(coverRef);
            coverUrl = coverFileUrl;
        }

        if (photoFiles) {
            // console.log('uploading photos..');
            for (let i = 0; i < photoFiles.length; i++) {
                const photoRef = ref(storage, `photographers/${params.uid}/albums/${randNum}/${i + 1}.jpg`);
                const photoUploadRes = await uploadBytes(photoRef, photoFiles[i]);
                const photoFileUrl = await getDownloadURL(photoRef);
                photoUrls[`${i + 1}`] = photoFileUrl;
            }
        }
        

        return {coverUrl, photoUrls, randNum}
    }


    async function addAlbum(res, data) {
        const finalData = {
            name: data.name,
            year: data.year,
            cover: res.coverUrl,
            photos: res.photoUrls
        }

        await setDoc(doc(db, `photographers/${params.uid}/albums`, res.randNum), finalData);
    }



    function coverFileHandle(f) {
        setCoverFile(f);
    }

    function photoFilesHandle(f) {
        setPhotoFiles(f);
    }


    return (
        <div className= {styles.newAlbum}>
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
            <div className={styles.titleWrapper}>
                <PhotoAlbumIcon/>
                <span>Add New Album</span>
            </div>

            <form onSubmit={formSubmitHandle}>
                <div className={styles.formInputs}>
                    <div className={styles.inputs}>
                        <TextField id="name" label="Album Name" sx={{backgroundColor: "white", width: '70%'}}  variant="outlined" />
                        <TextField id="year" label="Year" sx={{backgroundColor: "white", width: '30%'}}  variant="outlined" />
                    </div>

                    <FileSelectBtn 
                        id="AlbumCoverPhotoSelectBtn"
                        text="Select Album Cover Photo"
                        fileHandler={coverFileHandle}
                    />

                    <PhotoSelectionBox fileHandler={photoFilesHandle} />

                    <LoadingButton
                        type='submit'
                        loading={loading}
                        endIcon={<AddIcon />}
                        loadingPosition="end"
                        variant="contained"
                        fullWidth
                    >
                        Add Album
                    </LoadingButton>
                </div>
            </form>
        </div>
    );
}
