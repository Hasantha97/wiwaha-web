import React, { useState, useEffect, useContext } from "react";
import { db } from '@Utils/firebase';
import { doc, getDoc} from 'firebase/firestore/lite';
import { deleteDoc } from "firebase/firestore/lite";
import { storage } from '../../utils/firebase';
import { ref, listAll, deleteObject } from "firebase/storage";
import { useParams, useNavigate } from 'react-router';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './AlbumView.module.css';
import Button from '@mui/material/Button';

import { AuthContext } from '../../context/AuthContext';

const RemoveBtn = (props) => {
    return (
        <Button 
            className={styles.removeBtn}
            onClick={props.clickHandle} 
            sx={{
                textTransform: 'none',
                position: 'absolute',
                right: '40px',
                bottom: '10px'
            }}
            variant="outlined" 
            endIcon={<DeleteIcon />}
            size="small"
            color='error'
        >
            Delete Album
        </Button>
    )
}

export default function AlbumView(props) {
    const { user } = useContext(AuthContext);
    const [photos, setPhotos] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let params = useParams();

    useEffect(() => {
        getPhotos()
        .then((photos) => {setPhotos(photos)})
        .catch((err) => {alert(`Could not get photos. Try again later.`)});
    }, [])

    async function getPhotos() {
        const docRef = doc(db, `photographers/${params.uid}/albums/${props.id}`)
        const docSnap = await getDoc(docRef);

        const photosArr = Object.keys(docSnap.data().photos).map(key => docSnap.data().photos[key]);

        return photosArr;
    }

    function deleteAlbum() {
        setLoading(true);

        deleteDbDoc()
        .then(() => {
            deleteFiles(`photographers/${user.uid}/albums/${props.id}`)
            .then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            })
        })
        .catch((err) => {alert('Could not delete album.\nPlease try again later.')})
    }

    
    async function deleteDbDoc() {
        await deleteDoc(doc(db, `photographers/${user.uid}/albums`, props.id));
    }


    async function deleteFiles(path) {
        const storageRef = ref(storage, path);
        await listAll(storageRef)
        .then((dir) => {
            dir.items.forEach((fileRef) => {
            const newRef = ref(storage, `${storageRef.fullPath}/${fileRef.name}`);
            deleteObject(newRef)
          });
        });
    }

    function removeBtnClickHandle() {
        setDialog(true);
    }

    function noClickHandle() {
        setDialog(false);
    }


    return (
        <div className={styles.photoContainer}>
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
            {
                user && 
                user.uid === params.uid && 
                <RemoveBtn clickHandle={removeBtnClickHandle}/>
            }
            <div className={styles.titleWrapper}>
                <PhotoLibraryRoundedIcon sx={{marginRight: '5px'}} />
                <span>{props.name}</span>
                <span> / </span>
                <span>{props.title}</span>
                <span>{props.year ? `(${props.year})` : ''}</span>
            </div>
            <div className={styles.photosGrid}>
                <ImageList variant="masonry" cols={3} gap={10}>
                    {photos.length > 0 &&
                        photos.map((p, i) => (
                            <ImageListItem key={i}>
                                <img
                                    src={p}
                                    alt={p}
                                    loading="lazy"
                                    onClick={props.photoClickHandle}
                                />
                            </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <Dialog 
                open={dialog}
            >
                <DialogTitle>Delete Album</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this album?<br/>
                        This action can not be undone!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        onClick={deleteAlbum}
                        loading={loading}
                        endIcon={<DeleteIcon/>}
                        loadingPosition="end"
                        color="error"
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