import React, { useState } from 'react';
import SelectAndCrop from "./ImageCropper";
import axios from 'axios';
import { storage } from '../firebase/FireBase';
import "../style/img-selector.css";

const ImageSelector = (props) => {
    const [fileInputImage, setFileInputImage] = useState("");
    const [croppedImgSrc, setCroppedImgSrc] = useState("");
    const [fileTooBig, setFileTooBig] = useState(false);
    const [unsupportedTypeError, setUnsupportedTypeError] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [newImgFile, setNewImgFile] = useState();

    function fileIsImage(file) {
        const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        return file && acceptedImageTypes.includes(file['type']);
    }

    //and set the error handlers
    function checkIfFileIsAppropriate(file) {
        if (file == null) {
            return;
        }

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

    function changeImg() {
        axios.get("http://localhost:8080/img/file-name", { withCredentials: true }).then(response => {
            let fileName = response.data;

            let uploadTask;
            if (croppedImgSrc === "") {
                uploadTask = storage.ref(`/profiles/${fileName}`).put(newImgFile);
            } else {
                uploadTask = storage.ref(`/profiles/${fileName}`).putString(croppedImgSrc, "data_url", { contentType: "image/jpg" });
            }
            //initiates the firebase side uploading 
            uploadTask.on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    // console.log(snapShot)
                }, (err) => {
                    //catches the errors
                    console.error(err);
                    setNetworkError(true)
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref(`profiles/${fileName}`).getDownloadURL()
                        .then(fireBaseUrl => {
                            axios.post("http://localhost:8080/img/change", { user_id: fileName, url: fireBaseUrl }, { withCredentials: true })
                                .then(response => {
                                    alert("Image Changed Successfully!");
                                    window.location.reload(false);
                                }
                                ).catch(err => {
                                    console.error(err);
                                    setNetworkError(true)
                                }
                                )
                        })
                })
        }).catch(err => {
            handleErrors(err);
        })
    }

    function uploadImg() {
        axios.get("http://localhost:8080/img/file-name", { withCredentials: true }).then(response => {
            let fileName = response.data;
            let uploadTask;
            if (croppedImgSrc === "") {
                uploadTask = storage.ref(`/profiles/${fileName}`).put(newImgFile);
            } else {
                uploadTask = storage.ref(`/profiles/${fileName}`).putString(croppedImgSrc, "data_url", { contentType: "image/jpg" });
            }
            //initiates the firebase side uploading 
            uploadTask.on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    // console.log(snapShot)
                }, (err) => {
                    //catches the errors
                    console.error(err);
                    setNetworkError(true)
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref(`profiles/${fileName}`).getDownloadURL()
                        .then(fireBaseUrl => {
                            axios.post("http://localhost:8080/img/upload", { user_id: fileName, url: fireBaseUrl }, { withCredentials: true })
                                .then(response => {
                                    alert("Image Uploaded Successfully!");
                                    window.location.reload(false);
                                }
                                ).catch(err => {
                                    console.error(err);
                                    setNetworkError(true)
                                }
                                )
                        })
                })
        }).catch(err => {
            handleErrors(err);
        })
    }

    const saveImg = (e) => {
        e.preventDefault();
        setAllErrorsToFalse();
        if (!checkIfFileIsAppropriate(newImgFile)) {
            return;
        }
        //check if the user simply uploads or changes their profile picture
        if (props.isThereOldImg) {
            uploadImg();
        } else {
            changeImg();
        }

    }

    const handleErrors = (error) => {
        if (error.response && error.response.status === 403) {
            setAuthError(true);
        } else {
            setNetworkError(true);
        }
    }

    const onFileChangeHandler = (e) => {
        e.preventDefault();
        setFileInputImage("");

        setAllErrorsToFalse();
        if (!checkIfFileIsAppropriate(e.target.files[0])) {
            return;
        }

        let file = e.target.files[0];

        // let reader = new FileReader();
        // reader.onloadend = () => {
        //     setNewImgUrl(reader.result) //and then its displayable
        // }
        // reader.readAsDataURL(file);

        setNewImgFile(file);
        setFileInputImage(URL.createObjectURL(file));
    };

    return (
        <div className="container">
            {unsupportedTypeError ? <h1 style={{ color: "red" }}>Unsupported Type! Only JPG/JPEG and PNG allowed!</h1> : null}
            {fileTooBig ? <h1 style={{ color: "red" }}>The file is too big! The maximum size is 10MB!</h1> : null}
            {networkError ? <h1 style={{ color: "red" }}>Sorry, unexpected Network Error occurred!</h1> : null}
            {authError ? <h1 style={{ color: "red" }}>You have to log in or register!</h1> : null}

            {fileInputImage !== "" ?
                <>
                    <h3>
                        Crop it if you want!
                    </h3>
                    <button onClick={() => {
                        setFileInputImage("");
                        setCroppedImgSrc("");
                    }}>Clear Image</button>

                    <SelectAndCrop
                        image={fileInputImage}
                        getCroppedImgSrc={setCroppedImgSrc}
                        allowUserControls={true}
                    />
                </> :
                <div style={{ margin: "auto", width: "max-content", padding: "1rem" }}>
                    <label htmlFor="file" style={{ cursor: "pointer", border: "solid 0.15rem", padding: "0.1rem" }}>Select Image</label>
                    <input id="file" style={{ display: "none" }} type="file" onChange={onFileChangeHandler}></input>
                </div>}

            {croppedImgSrc !== "" ?
                <>
                    <img alt="cropped" src={croppedImgSrc} />
                    <div>
                        <button onClick={() => { setCroppedImgSrc("") }}>Reset</button>
                    </div>
                </>
                :
                null}

            <div style={{ margin: "auto", width: "min-content", textAlign: "center" }}>
                <button className="save-img-button" onClick={saveImg}>{props.isThereOldImg ? "Upload" : "Change"}</button>
                {fileInputImage === "" ? <p className="hiddenMissingInputMessage">Add an image first.</p> : null}
            </div>
        </div>)
}

export default ImageSelector;
