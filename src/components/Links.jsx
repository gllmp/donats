import React, { Component } from 'react';
import { authenticationService } from '../services';
import { Nav, Button } from 'react-bootstrap';

class Links extends Component {
    
    logout() {
        authenticationService.logout();
    }
  
    render() {
        return (
            <React.Fragment>
                <Nav className="mr-auto">
                    <Nav.Link className="nav-link" href={process.env.PUBLIC_URL + "/admin/videos/list"}>VIDEOS</Nav.Link>
                    <Nav.Link className="nav-link" href={process.env.PUBLIC_URL + "/admin/categories/list"}>CATEGORIES</Nav.Link>
                    <Nav.Link className="nav-link nav-link-button" href={process.env.PUBLIC_URL + "/admin/videos/create"}>ADD VIDEO</Nav.Link>
                    <Nav.Link className="nav-link nav-link-button" href={process.env.PUBLIC_URL + "/admin/categories/create"}>ADD CATEGORY</Nav.Link>
                </Nav>
                <Button id="logout-button" className="nav-link mr-sm-2 pr-4" onClick={this.logout}>LOGOUT</Button>
            </React.Fragment>
        )
    }
}

export default Links;
