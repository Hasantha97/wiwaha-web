import React from "react";
import { useState } from "react";
import './SmoothImg.css';

function SmoothImg(props) {
    const [loaded, setLoaded] = useState(false);

    return (
        <img 
            src={props.src}
            alt={props.alt}
            loading={props.loading}
            className={
                `smooth-img smooth-img-${loaded ? 'visible' : 'hidden'} ${props.className}`
            }
            onLoad={() => {setLoaded(true)}}
            onClick={props.onClick}
        />
    )
}

export default SmoothImg;