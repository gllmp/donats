import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import api from './api';
import App from './App';
import * as serviceWorker from './serviceWorker';

let data;

const start = async () => {
    await api.getAllVideos().then(videos => {
        data = videos.data.data;
    }).then( () => {
        const loadingContainer = document.getElementById("loading-container");
        loadingContainer.classList.add("fade-out");
        loadingContainer.addEventListener("animationend", () => {
            loadingContainer.classList.add("hide");

            document.getElementById('root').classList.add("fade-in");
            ReactDOM.render(
                <App appData={JSON.stringify(data)}/>,
                document.getElementById('root')
            );            
        });
    }).catch(() => {

    }).finally(() => {

    });
}

start();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
