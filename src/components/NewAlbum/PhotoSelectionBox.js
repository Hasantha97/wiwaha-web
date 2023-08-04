import React, { useState } from 'react';
import styles from './PhotoSelectionBox.module.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { List } from '@mui/material'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ImageIcon from '@mui/icons-material/Image';


const Input = styled('input')({
    display: 'none',
});


const FilesList = (props) => {
    return (
        <List>
            {props.files.map((f) => (
                <ListItem disablePadding>
                    <ListItemButton disablePadding>
                        <ListItemIcon>
                            <ImageIcon />
                        </ListItemIcon>
                        <ListItemText primary={f.name} />
                        <ListItemText inset>{Math.round(f.size / 1000)} KB</ListItemText>
                        <ListItemText primary={f.type} inset />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

const AddPhotosBtn = (props) => {
    return (
        <label htmlFor="photos-browse" style={{width: '100%', height: '100%'}}>
            <Input 
                accept=".jpg, .jpeg" 
                id="photos-browse" 
                type="file" 
                onChange={props.handler} 
                multiple 
            />
            <Button 
                sx={{
                    textTransform: 'none', 
                    height: '100%', 
                    fontSize: '1.5em',
                    '& .MuiButton-endIcon > :nth-of-type(1)': {
                        fontSize: '1.5em'
                    }
                }} 
                endIcon={<FileUploadOutlinedIcon/>} 
                variant="text"
                component="span" 
                fullWidth
            >
                Add Photos
            </Button>
        </label>
    );

}


export default function PhotoSelectionBox(props) {
    const [photoFiles, setPhotoFiles] = useState([]);


    function getFiles(e) {
        let files = e.currentTarget.files;

        if (files.length > 10) {
            alert('You can only select upto 10 photos!');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (Math.round(files[i].size / 1000) >= 1000) {
                alert('Please select photos under 1MB!');
                return;
            }
        }
    
        setPhotoFiles(Array.from(files));
        props.fileHandler(files);
    }


    return (
        <div className={styles.box}>
            {photoFiles.length > 0 
                ? <FilesList files={photoFiles} />
                : <AddPhotosBtn handler={getFiles} />
            }
        </div>
    );
}
