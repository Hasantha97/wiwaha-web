import React from 'react';
import Backdrop from '@mui/material/Backdrop';

export default function PhotoView(props) {
    return (
        // <Backdrop
        //     open={true}
        //     sx={{color: '#ffffff', zIndex: 101, overflow: 'hidden'}}
        //     transitionDuration={300}
        //     onClick={props.closeHandle}
        // >
        <img src={props.src} alt={props.src} style={{borderRadius: '26px', maxHeight: '98%', maxWidth: '90%'}} />
        // </Backdrop>
    )
}