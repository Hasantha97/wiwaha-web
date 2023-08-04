import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore/lite';
import { useNavigate } from 'react-router';
import Cover from '@Components/Profile/Cover'
import Info from '@Components/Profile/Info';
import Albums from '@Components/Profile/Albums';
import NewAlbum from '@Components/NewAlbum';
import AlbumView from '@Components/AlbumView';
import PhotoView from '@Components/PhotoView';
import EditProfile from '@Components/EditProfile';
import Dialog from '@mui/material/Dialog';
import { AuthContext } from '@Context/AuthContext';
import Backdrop from '@mui/material/Backdrop';
import "./Profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [photographer, setPhotographer] = useState({});
    const [albumViewData, setAlbumViewData] = useState({});
    const [albumView, setAlbumView] = useState(false);
    const [photoViewSrc, setPhotoViewSrc] = useState('');
    const [photoView, setPhotoView] = useState(false);
    const [addAlbum, setAddAlbum] = useState(false);
    const [editProfile, setEditProfile] = useState(false);

    const params = useParams();

    useEffect(() => {
        // console.log('useEffect - Profile');
        window.scrollTo(0, 0);
        
        getPhotographer()
        .then((doc) => {
            if (doc.exists()) {
                setPhotographer(doc.data());
                setLoading(false);
            } else {
                navigate('/404');
            }
        }).catch((err) => {alert('Could not get photographer data. Try again later.')})
    }, [params.uid])


    async function getPhotographer() {
        const docReference = doc(db, `photographers/${params.uid}`);
        const dSnapshot = await getDoc(docReference);

        return dSnapshot;
    }

    function albumClickHandle(e) {
        let id = e.currentTarget.getAttribute('id');
        let title = e.currentTarget.getAttribute('title');
        let year = e.currentTarget.getAttribute('year');

        setAlbumViewData({
            id: id,
            name: photographer['name'],
            title: title,
            year: year
        });

        setAlbumView(true);
    }

    function albumViewCloseHandle() {
        // setAlbumViewData({})
        setAlbumView(false);
    }

    function photoClickHandle(e) {
        let src = e.currentTarget.getAttribute('src');
        setPhotoViewSrc(src);
        setPhotoView(true);
    }

    function photoViewCloseHandle() {
        // setPhotoViewSrc('');
        setPhotoView(false);
    }

    function addAlbumClickHandle() {
        setAddAlbum(true);
    }

    function addAlbumCloseHandle() {
        setAddAlbum(false);
    }

    function editProfileClickHandle() {
        setEditProfile(true);
    }

    function editProfileCloseHandle() {
        setEditProfile(false);
    }


    if (loading) {
        return null;
    }

    return (
        <div className="photographer" >
            <Cover
                bg={photographer.cover}
                dp={photographer.dp}
                name={photographer.name}
                editProfileHandle={editProfileClickHandle}
            />

            <Info
                description={photographer.description}
                contact={photographer.contact}
            />

            <Albums 
                albumClickHandle={albumClickHandle} 
                addAlbumClickHandle={addAlbumClickHandle}  
            />

            {/* {Object.keys(albumViewData).length > 0 &&
                <AlbumView
                    key={albumViewData.id}
                    id={albumViewData.id}
                    name={albumViewData.name}
                    title={albumViewData.title}
                    year={albumViewData.year}
                    closeHandle={albumViewCloseHandle}
                    photoClickHandle={photoClickHandle}
                />
            } */}


            <Dialog
                open={albumView}
                maxWidth='xl'
            >
                <AlbumView
                    key={albumViewData.id}
                    id={albumViewData.id}
                    name={albumViewData.name}
                    title={albumViewData.title}
                    year={albumViewData.year}
                    closeHandle={albumViewCloseHandle}
                    photoClickHandle={photoClickHandle}
                />
            </Dialog>
      

            {/* {photoViewSrc.length > 0 &&
                <PhotoView 
                    src={photoViewSrc} 
                    closeHandle={photoViewCloseHandle} 
                />
            } */}

            <Backdrop
                open={photoView}
                sx={{color: '#ffffff', zIndex: 1500, overflow: 'hidden'}}
                transitionDuration={300}
                onClick={photoViewCloseHandle}
            >
                <PhotoView 
                    src={photoViewSrc} 
                    closeHandle={photoViewCloseHandle} 
                />
            </Backdrop>


            <Dialog
                open={addAlbum}
            >
                <NewAlbum closeHandle={addAlbumCloseHandle} />
            </Dialog>

            <Dialog
                open={editProfile}
            >
                <EditProfile photographer={photographer} closeHandle={editProfileCloseHandle} />
            </Dialog>

        </div>
    );
}
