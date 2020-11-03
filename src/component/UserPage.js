import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageSelector from "./ImageSelector";
import { storage } from '../firebase/FireBase';

const UserPage = (props) => {
    const [oldImgUrl, setOldImgUrl] = useState("");
    const [networkError, setNetworkError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [croppedImgSrc, setCroppedImgSrc] = useState("");
    const [inputFileUrl, setInputFileUrl] = useState("");
    const [newImgFile, setNewImgFile] = useState();

    useEffect(() => {
        axios.get("http://localhost:8080/img/profile-url", { withCredentials: true })
            .then(response => {
                setOldImgUrl(response.data);
            }).catch(err => {
                handleErrors(err)
            })
    }, [])

    const handleErrors = (error) => {
        if (error.response && error.response.status === 403) {
            setAuthError(true);
        } else {
            setNetworkError(true);
        }
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

    if (localStorage.getItem("username") == null) {
        window.location.href = "/";
    } else {
        return (
            <div>
                <h1 style={{ textAlign: "center" }}>This is The User page!</h1>
                {oldImgUrl === "" ?
                    <h3 style={{ textAlign: "center" }}>You haven't set your profile picture yet!</h3>
                    :
                    <img style={{ display: "block", margin: "auto", maxWidth: "20rem", minWidth: "16rem" }} alt="profile" src={oldImgUrl} />
                }
                <ImageSelector
                    isThereOldImg={oldImgUrl === ""}

                    changeImg={changeImg}
                    uploadImg={uploadImg}

                    croppedImgSrc={croppedImgSrc}
                    setCroppedImgSrc={setCroppedImgSrc}
                    newImgFile={newImgFile}
                    setNewImgFile={setNewImgFile}
                    inputFileUrl={inputFileUrl}
                    setInputFileUrl={setInputFileUrl}
                />

                {networkError ? <h1 style={{ color: "red" }}>Sorry, unexpected Network Error occurred!</h1> : null}
                {authError ? <h1 style={{ color: "red" }}>You have to log in or register!</h1> : null}

            </div>
        );
    }
}

export default UserPage;
