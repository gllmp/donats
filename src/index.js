import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import api from './api';
import App from './App';
import * as serviceWorker from './serviceWorker';

let data = [];

let routes = {
    home: "/",
    login: "/login",
    admin: "/admin",
    adminVideo: "/admin/videos",
    adminCategory: "/admin/categories"
    // adminVideoList: "/admin/videos/list",
    // adminVideoCreate: "/admin/videos/create",
    // adminVideoUpdate: "/admin/videos/update",
    // adminCategoryList: "/admin/categories/list",
    // adminCategoryCreate: "/admin/categories/create",
    // adminCategoryUpdate: "/admin/categories/update"
}

const startApp = async () => {
    if (window.location.pathname === "/" || window.location.pathname.includes(routes.adminVideo)) {
        await api.getAllVideos().then(videos => {
            data = videos.data.data;
        }).then( () => {
            renderApp(data);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {

        });
    } else if (window.location.pathname.includes(routes.adminCategory)) {
        await api.getAllCategories().then(categories => {
            console.log(categories);
        }).then( () => {
            renderApp(data);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
    
        });
    } else {
        renderApp(data);
    }
}

function renderApp(_data) {
    const loadingContainer = document.getElementById("loading-container");
    loadingContainer.classList.add("fade-out");
    loadingContainer.addEventListener("animationend", () => {
        loadingContainer.classList.add("hide");
   
        document.getElementById('root').classList.add("fade-in");
        
        ReactDOM.render(
            <App appData={JSON.stringify(_data)} />,
            document.getElementById('root')
        );                    
    });
}

startApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
