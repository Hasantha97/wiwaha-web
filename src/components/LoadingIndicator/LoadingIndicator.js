import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import './LoadingScreen.css'

function LoadingIndicator() {
    return (
        <div className="loading-screen">
            <CircularProgress />
        </div>
    )
}

export default LoadingIndicator;