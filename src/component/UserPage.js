import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fileDownload from "js-file-download";
import ImageSelector from "./ImageSelector";
import { storage } from '../firebase/FireBase';
import SelectAndCrop from "./ImageCropper";

const UserPage = (props) => {
    const [oldImgUrl, setOldImgUrl] = useState("");
    const [networkError, setNetworkError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [modifyImg, setModifyImg] = useState(false);
    const [croppedImgSrc, setCroppedImgSrc] = useState("");
    const [inputFileUrl, setInputFileUrl] = useState("");
    const [newImgFile, setNewImgFile] = useState();
    const [oldImgType, setOldImgType] = useState("");
    const [newImgType, setNewImgType] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/img/profile-img-data", { withCredentials: true })
            .then(response => {
                setOldImgUrl(response.data.url);
                setOldImgType(response.data.type);
            }).catch(err => {
                handleErrors(err)
            })
    }, [])

    const handleDownload = () => {
        axios.get(oldImgUrl, {
            responseType: 'blob',
        })
            .then((res) => {
                fileDownload(res.data, localStorage.getItem("username") + "." + oldImgType)
            })
    }

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
                uploadTask = storage.ref(`/profiles/${fileName}`).putString(croppedImgSrc, "data_url", { contentType: `image/${newImgType}` });
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
                            axios.post("http://localhost:8080/img/upload", { user_id: fileName, url: fireBaseUrl, imageType: newImgType }, { withCredentials: true })
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
                uploadTask = storage.ref(`/profiles/${fileName}`).putString(croppedImgSrc, "data_url", { contentType: `image/${newImgType}` });
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
                            axios.post("http://localhost:8080/img/change", { user_id: fileName, url: fireBaseUrl, imageType: newImgType }, { withCredentials: true })
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
                    <>
                        <img style={{ display: "block", margin: "auto", maxWidth: "20rem", minWidth: "16rem" }} alt="profile" src={oldImgUrl} />
                        <button onClick={() => { handleDownload("test.jpg") }}>
                            Download File
                        </button>
                        {newImgFile == null ? <button style={{ display: "block", margin: "auto" }}
                            onClick={() => {
                                if (modifyImg === true) {
                                    setNewImgType("");
                                } else {
                                    setNewImgType(oldImgType);
                                }
                                setModifyImg(!modifyImg);
                                setCroppedImgSrc("");
                            }}>
                            {modifyImg ? "Cancel" : "Modify Image"}
                        </button> : null}
                    </>
                }
                {!modifyImg ?
                    <ImageSelector
                        isThereOldImg={oldImgUrl === ""}

                        changeImg={changeImg}
                        uploadImg={uploadImg}

                        setCroppedImgSrc={setCroppedImgSrc}
                        newImgFile={newImgFile}
                        setNewImgFile={setNewImgFile}
                        inputFileUrl={inputFileUrl}
                        setInputFileUrl={setInputFileUrl}
                        setNewImgType={setNewImgType}
                    />
                    : null
                }

                {modifyImg && inputFileUrl === "" && oldImgUrl !== "" ?
                    <>
                        <SelectAndCrop
                            image={oldImgUrl}
                            getCroppedImgSrc={setCroppedImgSrc}
                            allowUserControls={true}
                        />
                        {croppedImgSrc !== "" ?
                            <button onClick={(e) => {
                                e.preventDefault();
                                changeImg();
                            }}>
                                Modify
                            </button> : null}
                    </>
                    : null}

                {croppedImgSrc !== "" ?
                    <>
                        <img alt="cropped" src={croppedImgSrc} />
                        <div>
                            <button onClick={() => { setCroppedImgSrc("") }}>Reset</button>
                        </div>
                    </>
                    :
                    null}

                {networkError ? <h1 style={{ color: "red" }}>Sorry, unexpected Network Error occurred!</h1> : null}
                {authError ? <h1 style={{ color: "red" }}>You have to log in or register!</h1> : null}

            </div>
        );
    }
}

export default UserPage;
