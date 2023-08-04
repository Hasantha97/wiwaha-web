import React from "react";
import { useState } from 'react';
import { Avatar } from '@mui/material';

export default function SmoothAvatar(props) {
    const [opacity, setOpacity] = useState(0);

    return (
        <Avatar 
            className={props.className}
            src={props.src}
            sx={{
                "& img" : {
                    transition: 'opacity ease-in .3s',
                    opacity: `${opacity}`
                }
            }}
            onLoad={() => {setOpacity(1)}}
        />
    )
}