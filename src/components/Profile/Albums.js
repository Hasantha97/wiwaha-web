import React, { useEffect, useState, memo, useContext } from 'react';
import { db } from '../../utils/firebase';
import PhotoAlbumRoundedIcon from '@mui/icons-material/PhotoAlbumRounded';
import { collection, getDocs} from 'firebase/firestore/lite';
import { useParams } from 'react-router';
import IconButton from '@mui/material/IconButton';
import SmoothImg from '../SmoothImg';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import "./Albums.css";
import { AuthContext } from '@Context/AuthContext';


const Album = (props) => {
    return (
        <div className="album" 
            id={props.id} 
            title={props.title} 
            year={props.year} 
            onClick={props.clickHandle}
        >
            <SmoothImg className="albumCover" src={props.bg}/>
            <span>{props.title}</span>
        </div>
    )
}


const AddAlbum = (props) => {
    return (
        <div className="addAlbum">
            <IconButton 
                sx={{ fontSize: 65 }}
                onClick={props.clickHandle}
            >
                <AddCircleOutlineOutlinedIcon 
                    fontSize="inherit"
                />
            </IconButton>
        </div>
    )
};


function Albums(props) {
    const { user } = useContext(AuthContext);
    const [albums, setAlbums] = useState([]);
    const params = useParams();


    useEffect(() => {
        // console.log('useEffect - Albums');
        getAlbums()
        .then((docs) => {setAlbums(docs)})
        .catch((err) => {alert('Could not get albums. Try again later.')});
    }, [params.uid])


    async function getAlbums() {
        const colReference = collection(db, `photographers/${params.uid}/albums`);
        const qSanpshot = await getDocs(colReference);

        return qSanpshot.docs;
    }


    return (
        <div className="albums">
            <div className ="albumsTitleWrapper">
                <PhotoAlbumRoundedIcon fontSize="large" />
                <span>Albums</span>
            </div>
            <div className="albumGrid">
                    {albums.length > 0 && 
                        albums.map((a) => (
                            <Album
                                key={a.id}
                                id={a.id}
                                bg={a.data()['cover']}
                                title={a.data()['name']}
                                year={a.data()['year']}
                                clickHandle={props.albumClickHandle}
                            />
                        ))
                    }
                    {
                        user &&
                        user.uid === params.uid && 
                        albums.length < 8 && 
                        <AddAlbum clickHandle={props.addAlbumClickHandle} />
                    }
            </div>
        </div>
    );
}

export default memo(Albums);