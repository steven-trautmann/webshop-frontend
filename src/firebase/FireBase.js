import firebase from 'firebase/app'
import 'firebase/storage'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB72vt-msIVDhZfCvjeCSrt0Y1huodChz0",
    authDomain: "webshop-jobhunt-practise.firebaseapp.com",
    databaseURL: "https://webshop-jobhunt-practise.firebaseio.com",
    projectId: "webshop-jobhunt-practise",
    storageBucket: "webshop-jobhunt-practise.appspot.com",
    messagingSenderId: "345098824647",
    appId: "1:345098824647:web:e86cc0a24e91eb3004c7e2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

export {
    storage, firebase as default
}

