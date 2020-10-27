import React, { useState } from 'react';
import axios from 'axios';
import { storage } from '../firebase/FireBase';

const UserPage = (props) => {
    const [fileTooBig, setFileTooBig] = useState(false);
    const [unsupportedTypeError, setUnsupportedTypeError] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [imgUrl, setImgUrl] = useState();
    const [imgFile, setImgFile] = useState();

    function fileIsImage(file) {
        const acceptedImageTypes = ['image/jpeg', 'image/png'];
        return file && acceptedImageTypes.includes(file['type']);
    }

    //and set the error handlers
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

    function setAllErrorsToFalse() {
        setNetworkError(false);
        setFileTooBig(false);
        setUnsupportedTypeError(false);
    }

    const saveImg = (e) => {
        e.preventDefault();
        setAllErrorsToFalse();
        if (!checkIfFileIsAppropriate(imgFile)) {
            return;
        }
        axios.get("http://localhost:8080/img/file-name", { withCredentials: true }).then(response => {
            let fileName = response.data;
            const uploadTask = storage.ref(`/profiles/${fileName}`).put(imgFile);
            //initiates the firebase side uploading 
            uploadTask.on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    console.log(snapShot)
                }, (err) => {
                    //catches the errors
                    console.error(err);
                    setNetworkError(true)
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref('profiles').child(fileName).getDownloadURL()
                        .then(fireBaseUrl => {
                            axios.post("http://localhost:8080/img/upload", { name: fileName, url: fireBaseUrl }, { withCredentials: true })
                                .then(response => {
                                    alert("Image Uploaded Successfully!");
                                }
                                ).catch(err => {
                                    console.error(err);
                                    setNetworkError(true)
                                }
                                )
                        })
                })
        }).catch(err => {
            console.error(err);
            if (err.response && err.response.status === 403) {
                setAuthError(true);
            } else {
                setNetworkError(true);
            }
        })
    }

    const onFileChangeHandler = (e) => {
        e.preventDefault();
        setAllErrorsToFalse();
        if (!checkIfFileIsAppropriate(e.target.files[0])) {
            return;
        }

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setImgUrl(reader.result)
        }

        reader.readAsDataURL(file);

        setImgFile(file);
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>This is The User page!</h1>
            <div>
                <label for="file" class="btn" style={{ cursor: "pointer", border: "solid 0.15rem", padding: "0.1rem" }}>Select Image</label>
                <input id="file" style={{ display: "none" }} type="file" onChange={onFileChangeHandler}></input>
            </div>

            {unsupportedTypeError ? <h1 style={{ color: "red" }}>Unsupported Type! Only JPG/JPEG and PNG allowed!</h1> : null}
            {fileTooBig ? <h1 style={{ color: "red" }}>The file is too big! The maximum size is 10MB!</h1> : null}
            {networkError ? <h1 style={{ color: "red" }}>Sorry, unexpected Network Error occurred!</h1> : null}
            {authError ? <h1 style={{ color: "red" }}>You have to log in or register!</h1> : null}

            <br></br>
            <img style={{ maxWidth: "10rem", minWidth: "8rem" }} alt="" src={imgUrl} />
            <button onClick={saveImg}>Upload</button>
        </div>
    );
}

export default UserPage;
