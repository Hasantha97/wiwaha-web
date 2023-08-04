import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const Input = styled('input')({
    display: 'none',
});

export default function FileSelectBtn(props) {
    const [selectedFile, setSelectedFile] = useState({});

    function getFile(e) {
        let file = e.target.files[0];

        if (Math.round(file.size / 1000) >= 1000) {
            alert('Please select a file under 1MB!');
            return;
        }

        setSelectedFile(file);
        props.fileHandler(file);
    }

    return (
        <label htmlFor={props.id} style={{width: '100%'}}>
            <Input accept=".jpg, .jpeg" id={props.id} type="file" onChange={getFile} />
            <Button 
                sx={{textTransform: 'none', backgroundColor: "white"}} 
                endIcon={<FileUploadOutlinedIcon/>} 
                variant="outlined" 
                component="span" 
                fullWidth
            >
                {selectedFile.name !== undefined
                    ? selectedFile.name
                    : props.text}
            </Button>
        </label>
    );

}
