import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import api from './api';
import App from './App';
import * as serviceWorker from './serviceWorker';

// hide logs in production
if (process.env.NODE_ENV === 'production') {
    console.log = function () {};
}

let videoData = [];
let categoryData = [];

let routes = {
    home: "/",
    login: "/login",
    admin: "/admin",
    adminVideo: "/admin/videos",
    adminCategory: "/admin/categories"
}

const startApp = async () => {
    if (window.location.pathname === "/") {
        await api.getAllVideos().then(videos => {
            videoData = videos.data.data;
        }).then(async () => {
            await api.getAllCategories().then(categories => {
                categoryData = categories.data.data;
                // console.log(categoryData);
            }).then( () => {
                renderApp(videoData, categoryData);
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
        
            });
        }).catch((error) => {
            console.error(error);
        }).finally(() => {

        });
    } else if ( (window.location.pathname === routes.admin) || (window.location.pathname === routes.login) ) {
        renderApp();
    } else if (window.location.pathname.includes(routes.adminVideo)) {
        await api.getAllVideos().then(videos => {
            videoData = videos.data.data;
        }).then( () => {
            renderApp(videoData);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {

        });
    } else if (window.location.pathname.includes(routes.adminCategory)) {
        await api.getAllCategories().then(categories => {
            categoryData = categories.data.data;
            // console.log(categoryData);
        }).then( () => {
            renderApp(categoryData);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {

        });
    } else {
        window.location.pathname = "/";
        renderApp();
    }
}

function renderApp(_videoData = [], _categoryData = []) {
    const loadingContainer = document.getElementById("loading-container");
    loadingContainer.classList.add("fade-out");
    loadingContainer.addEventListener("animationend", () => {
        loadingContainer.classList.add("hide");
   
        document.getElementById('root').classList.add("fade-in");
        
        ReactDOM.render(
            <App videoData={JSON.stringify(_videoData)} categoryData={_categoryData} appRoute={window.location.pathname} />,
            document.getElementById('root')
        );
    });
}

startApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
