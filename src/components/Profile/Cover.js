import React, {useContext, memo} from 'react'
import "./Cover.css"
import SmoothImg from '../SmoothImg';
import SmoothAvatar from '../SmoothAvatar';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '@Context/AuthContext';
import { useParams } from 'react-router';

const EditProfileBtn = (props) => {
    return (
        <div className="editBtnWrapper">
            <Button 
                sx={{
                    textTransform: 'none',
                    color: 'black',
                    bgcolor: 'white',
                    ':hover': {
                        backgroundColor: '#eeeeee'
                    }
                }} 
                variant="contained" 
                size="medium"
                endIcon={<EditIcon />} 
                fullWidth 
                onClick={props.closeHandle}
            >
                Edit Profile
            </Button>
        </div>
    )
}

function Cover(props) {
    const { user } = useContext(AuthContext);
    const params = useParams();

    return (
        <div className ="photographer-cover">
            <SmoothImg className="cover-photo" src={props.bg} alt="Not Found" />
            <div className="dpTitleWrapper">
                <SmoothAvatar className="cover-dp" src={props.dp} />
                <div className="title-wrapper" >
                    <span>{props.name}</span>
                </div>
            </div>
            {
                user && 
                user.uid === params.uid && 
                <EditProfileBtn closeHandle={props.editProfileHandle} />
            }
        </div>
    );
}

export default memo(Cover);