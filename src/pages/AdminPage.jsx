import React from 'react';
import  quarantineImage from '../assets/img/quarantine-logo.gif';

function AdminPage() {
    return (
        <div id="logo-container" className="adminLogo">
            <a href={process.env.PUBLIC_URL + "/"}>
                <img id="quarantine-logo" src={quarantineImage} width="480" height="268" alt=""/>
            </a>
        </div>
    )
}

export default AdminPage;