import React, { useState } from 'react';
import axios from 'axios';

const UserPage = (props) => {
    const [fileTooBig, setFileTooBig] = useState(false);
    const [unsupportedTypeError, setUnsupportedTypeError] = useState(false);
    const [networkError, setNetworkError] = useState(false);

    function upload(data) {
        return axios.post("http://localhost:8080/img/upload", data, { withCredentials: true });
    }

    function fileIsImage(file) {
        const acceptedImageTypes = ['image/jpeg', 'image/png'];
        return file && acceptedImageTypes.includes(file['type']);
    }

    //and set them
    function checkIfFileIsAppropriate(file) {
        let somethingWrong = false;

        if (!fileIsImage(file)) {
            setUnsupportedTypeError(true);
            somethingWrong = true;
        }

        // if the file is bigger than 10MB
        if (file.size >= 10485760) {
            setFileTooBig(true);
            somethingWrong = true;
        }

        return !somethingWrong;
    }

    const handleErrors = (error) => {
        if (error.response == null) {
            setUnsupportedTypeError(false);
            setFileTooBig(false);
            setNetworkError(true);
            return;
        } else if (error.response.status === 400) {
            if (error.response.data.UnsupportedTypeError != null) {
                setUnsupportedTypeError(true);
            } else if (error.response.data.MaxUploadSizeExceededException) {
                setFileTooBig(true);
            }
        }
        setNetworkError(false);
    }

    function setAllErrorsToFalse() {
        setNetworkError(false);
        setFileTooBig(false);
        setUnsupportedTypeError(false);
    }

    const onFileChangeHandler = (e) => {
        e.preventDefault();
        setAllErrorsToFalse();
        if (!checkIfFileIsAppropriate(e.target.files[0])) {
            return;
        }

        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        upload(formData).then(res => {
            console.log(res.data);
            setAllErrorsToFalse();
            alert("File uploaded successfully.");
        }).catch((e) => handleErrors(e))
    };

    return (
        <div>
            <h1>This is The User page!</h1>
            <input type="file" name="file" onChange={onFileChangeHandler} />
            {unsupportedTypeError ? <h1 style={{ color: "red" }}>Unsupported Type! Only JPG/JPEG and PNG allowed!</h1> : null}
            {fileTooBig ? <h1 style={{ color: "red" }}>The file is too big! The maximum size is 10MB!</h1> : null}
            {networkError ? <h1 style={{ color: "red" }}>Sorry, unexpected Network Error occurred!</h1> : null}
        </div>
    );
}

export default UserPage;
