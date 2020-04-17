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
                <Nav.Link className="nav-link" href={process.env.PUBLIC_URL + "/"}>HOME</Nav.Link>
                <Nav.Link className="nav-link" href={process.env.PUBLIC_URL + "/admin/videos/list"}>LIST</Nav.Link>
                <Nav.Link className="nav-link" href={process.env.PUBLIC_URL + "/admin/videos/create"}>ADD VIDEO</Nav.Link>
                </Nav>
                <Button className="nav-link mr-sm-2 pr-4" onClick={this.logout}>LOGOUT</Button>
            </React.Fragment>
        )
    }
}

export default Links;
