import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';
import { useNavigate } from 'react-router';
import "./Feed.css";
import Header from '../Header';
// import SignIn from './SignIn';
import SmoothImg from '../SmoothImg';
import SmoothAvatar from '../SmoothAvatar';


const Item = (props) => {
    const navigate = useNavigate();

    function ItemclickHandle(e) {
        navigate(`/profile/${e.currentTarget.id}`)
    }

    return (
        <div className="featured_item" id={props.id} onClick={ItemclickHandle}>
            <div className="bg_wrapper">
                <SmoothImg className="bg" src={props.bg} />
            </div>
            <div className="dp_wrapper">
                <SmoothAvatar className="dp" src={props.dp} />
            </div>
            <div className="name_wrapper">
                <p>{props.name}</p>
            </div>
        </div>
    )
}


function Feed() {
    const [loading, setLoading] = useState(true);
    const [photographers, setPhotographers] = useState([]);


    useEffect(() => {
        // console.log('useEffect - Feed');
        getPhotographers()
        .then((docs) => {
            setPhotographers(docs);
            setLoading(false);
        })
        .catch((err) => {alert('Could not get photographers. Try again later.')});

    }, []);


    async function getPhotographers() {
        const colReference = collection(db, 'photographers');
        const qSnapshot = await getDocs(colReference);
        
        return qSnapshot.docs;
    }

    
    if (loading) {
        return null;
    }

    return (
        <div className="feed">
            {
                photographers.length > 0 && 
                photographers.map((p) => (
                    <Item
                        key={p.id}
                        id={p.id}
                        bg={p.data()['cover']}
                        dp={p.data()['dp']}
                        name={p.data()['name']}
                    />
                ))
            }
        </div>
    );
}

export default Feed;
