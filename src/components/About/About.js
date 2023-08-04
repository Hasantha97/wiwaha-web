import React from 'react'
import style from "./About.module.css"
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import logo from '@Assets/logo.png'

export default function About() {
    return (
        <div className={style.aboutUs}>
            <div className={style.logo}>
                <img src={logo}  />
            </div>
            <div className={style.title}>
                <h2>About Us</h2>
                <samp>Find best photographers for your wedding.</samp>
            </div>
            <div className={style.contactUs}>
                <h2>Contact Us</h2>
                    <div className={style.contactBox}>
                        <div className={style.email}>
                            <EmailIcon/>
                            <samp>wiwaha@gmail.com </samp>
                        </div>

                        <div className={style.phone}>
                            <PhoneIcon/>
                            <samp>+94323122825</samp>
                        </div>
                    </div>
                    
            </div>
        </div>
    )
}
