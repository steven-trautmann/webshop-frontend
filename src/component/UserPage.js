import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageSelector from "./ImageSelector";

const UserPage = (props) => {
    const [oldImgUrl, setOldImgUrl] = useState("");
    const [networkError, setNetworkError] = useState(false);
    const [authError, setAuthError] = useState(false);

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
                <ImageSelector oldImgUrl={oldImgUrl} />

                {networkError ? <h1 style={{ color: "red" }}>Sorry, unexpected Network Error occurred!</h1> : null}
                {authError ? <h1 style={{ color: "red" }}>You have to log in or register!</h1> : null}

            </div>
        );
    }
}

export default UserPage;
