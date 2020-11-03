import React, { useState } from 'react';
import SelectAndCrop from "./ImageCropper";
import "../style/img-selector.css";

const ImageSelector = (props) => {
    const [fileTooBig, setFileTooBig] = useState(false);
    const [unsupportedTypeError, setUnsupportedTypeError] = useState(false);
    const [networkError, setNetworkError] = useState(false);

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

    const saveImg = (e) => {
        e.preventDefault();
        setAllErrorsToFalse();
        if (!checkIfFileIsAppropriate(props.newImgFile)) {
            console.log("iff!");
            return;
        }
        //check if the user simply uploads or changes their profile picture
        if (props.isThereOldImg) {
            props.uploadImg();
        } else {
            props.changeImg();
        }

    }

    const onFileChangeHandler = (e) => {
        e.preventDefault();

        setAllErrorsToFalse();
        if (!checkIfFileIsAppropriate(e.target.files[0])) {
            return;
        }

        let file = e.target.files[0];

        props.setInputFileUrl(URL.createObjectURL(file));
        props.setNewImgFile(file);

        // let reader = new FileReader();
        // reader.onloadend = () => {
        //     setNewImgUrl(reader.result) //and then its displayable
        // }
        // reader.readAsDataURL(file);
    };

    return (
        <div className="container">
            {unsupportedTypeError ? <h1 style={{ color: "red" }}>Unsupported Type! Only JPG/JPEG and PNG allowed!</h1> : null}
            {fileTooBig ? <h1 style={{ color: "red" }}>The file is too big! The maximum size is 10MB!</h1> : null}
            {networkError ? <h1 style={{ color: "red" }}>Sorry, unexpected Network Error occurred!</h1> : null}

            {props.inputFileUrl !== "" ?
                <>
                    <h3>
                        Crop it if you want!
                    </h3>
                    <button onClick={() => {
                        props.setInputFileUrl("");
                        props.setCroppedImgSrc("");
                        props.setNewImgFile();
                    }}>Clear Image</button>

                    <SelectAndCrop
                        image={props.inputFileUrl}
                        getCroppedImgSrc={props.setCroppedImgSrc}
                        allowUserControls={true}
                    />
                </> :
                <div style={{ margin: "auto", width: "max-content", padding: "1rem" }}>
                    <label htmlFor="file" style={{ cursor: "pointer", border: "solid 0.15rem", padding: "0.1rem" }}>Select Image</label>
                    <input id="file" style={{ display: "none" }} type="file" onChange={onFileChangeHandler}></input>
                </div>}

            <div style={{ margin: "auto", width: "min-content", textAlign: "center" }}>
                <button className="save-img-button" onClick={saveImg}>{props.isThereOldImg ? "Upload" : "Change"}</button>
                {props.inputFileUrl === "" ? <p className="hiddenMissingInputMessage">Add an image first.</p> : null}
            </div>
        </div>)
}

export default ImageSelector;
