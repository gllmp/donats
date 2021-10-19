import React, { Component } from 'react';
import Links from './Links';
import { Navbar } from 'react-bootstrap';

class AdminNavBar extends Component {
    render() {
        return (
            <Navbar className="admin-navbar-container navbar-dark" expand="lg">
            <Navbar.Brand id="admin-navbar-title" className="ml-4" href={process.env.PUBLIC_URL + "/admin"}><p>DONATS</p>ADMIN</Navbar.Brand>
            <Navbar.Toggle aria-controls="admin-navbar-nav" />
            <Navbar.Collapse id="admin-navbar-nav">
                <Links />                
            </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default AdminNavBar;
