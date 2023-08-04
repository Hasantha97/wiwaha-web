import React from 'react';
import { memo } from 'react';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import "./Info.css";


function Info(props) {
    return (
        <div className="photographer-info">
            <div className="description">
                <span className="info-title">About</span>
                <div className="description-wrapper">
                    <span>
                        {props.description && props.description}
                    </span>
                </div>

            </div>
            <div className="contact-info">
                <span className="info-title">Contact</span>
                <div className="contact-details">
                    <div className="details-wrapper">
                        <CallIcon sx={{ fontSize: 30 }} />
                        <span>
                            {props.contact && props.contact['phone']}
                        </span>
                    </div>
                    <div className="details-wrapper">
                        <EmailIcon sx={{ fontSize: 30 }} />
                        <span>
                            {props.contact && props.contact['email']}
                        </span>
                    </div>
                    <div className="details-wrapper">
                        <LanguageIcon sx={{ fontSize: 30 }} />
                        <span>
                            {props.contact && props.contact['website']}
                        </span>
                    </div>
                    <div className="details-wrapper">
                    <LocationOnIcon sx={{ fontSize: 30 }} />
                        <span>
                            {props.contact && props.contact['address']}
                        </span>
                    </div>
                </div>
            </div>
            <div className="map">
                <span className="info-title">Map(Coming soon!)</span>
            </div>
        </div>
    )
}

export default memo(Info);