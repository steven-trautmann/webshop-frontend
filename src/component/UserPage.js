import React, { useState } from 'react';
import axios from 'axios';

const UserPage = (props) => {

    function upload(data) {
        return axios.post("http://localhost:8080/img/upload", data);
    }

    const onFileChangeHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        upload(formData).then(res => {
            console.log(res.data);
            alert("File uploaded successfully.");
        }).catch((error) => {
            console.log(error);
        })
    };

    return (
        <div>
            <h1>This is The User page!</h1>
            <input type="file" name="file" onChange={onFileChangeHandler} />
        </div>
    );
}

export default UserPage;
