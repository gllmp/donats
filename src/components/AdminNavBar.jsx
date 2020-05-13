import React, { Component } from 'react';
import Links from './Links';
import { Navbar } from 'react-bootstrap';

class AdminNavBar extends Component {
    render() {
        return (
            <Navbar className="admin-navbar-container" expand="lg">
            <Navbar.Brand className="ml-4" href={process.env.PUBLIC_URL + "/admin"}>ADMIN</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Links />                
            </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default AdminNavBar;
