import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from '../firebase/FireBase';

const UserPage = (props) => {
    if (localStorage.getItem("username") == null) {
        window.location.href = "/";
    }

    const [fileTooBig, setFileTooBig] = useState(false);
    const [unsupportedTypeError, setUnsupportedTypeError] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [oldImgUrl, setOldImgUrl] = useState("");
    const [newImgUrl, setNewImgUrl] = useState();
    const [newImgFile, setNewImgFile] = useState();

    function fileIsImage(file) {
        const acceptedImageTypes = ['image/jpeg', 'image/png'];
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
            const uploadTask = storage.ref(`/profiles/${fileName}`).put(newImgFile);
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
                    storage.ref('profiles').child(fileName).getDownloadURL()
                        .then(fireBaseUrl => {
                            axios.post("http://localhost:8080/img/change", { name: fileName, url: fireBaseUrl }, { withCredentials: true })
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
            const uploadTask = storage.ref(`/profiles/${fileName}`).put(newImgFile);
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
                    storage.ref('profiles').child(fileName).getDownloadURL()
                        .then(fireBaseUrl => {
                            axios.post("http://localhost:8080/img/upload", { name: fileName, url: fireBaseUrl }, { withCredentials: true })
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
        if (oldImgUrl === "") {
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
        setAllErrorsToFalse();
        if (!checkIfFileIsAppropriate(e.target.files[0])) {
            return;
        }

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setNewImgUrl(reader.result)
        }

        reader.readAsDataURL(file);

        setNewImgFile(file);
    };

    useEffect(() => {
        axios.get("http://localhost:8080/img/profile-url", { withCredentials: true })
            .then(response => {
                setOldImgUrl(response.data);
            }).catch(err => {
                handleErrors(err)
            })
    }, [])

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>This is The User page!</h1>
            {oldImgUrl === "" ?
                <h3 style={{ textAlign: "center" }}>You haven't set your profile picture yet!</h3>
                :
                <img style={{ display: "block", margin: "auto", maxWidth: "20rem", minWidth: "16rem" }} alt="profile" src={oldImgUrl} />
            }
            <div style={{ margin: "auto", width: "max-content", padding: "1rem" }}>
                <label htmlFor="file" style={{ cursor: "pointer", border: "solid 0.15rem", padding: "0.1rem" }}>Select Image</label>
                <input id="file" style={{ display: "none" }} type="file" onChange={onFileChangeHandler}></input>
            </div>

            {unsupportedTypeError ? <h1 style={{ color: "red" }}>Unsupported Type! Only JPG/JPEG and PNG allowed!</h1> : null}
            {fileTooBig ? <h1 style={{ color: "red" }}>The file is too big! The maximum size is 10MB!</h1> : null}
            {networkError ? <h1 style={{ color: "red" }}>Sorry, unexpected Network Error occurred!</h1> : null}
            {authError ? <h1 style={{ color: "red" }}>You have to log in or register!</h1> : null}

            <div style={{ margin: "auto", width: "min-content", textAlign: "center" }}>
                <img style={{ maxWidth: "10rem", minWidth: "8rem" }} alt="" src={newImgUrl} />
                <button onClick={saveImg}>{oldImgUrl === "" ? "Upload" : "Change"}</button>
            </div>
        </div>
    );
}

export default UserPage;
