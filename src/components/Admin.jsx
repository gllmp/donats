import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AdminNavBar } from '../components';
import { AdminPage, VideoList, VideoInsert, VideoUpdate } from '../pages';
import Footer from './Footer';

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    
    componentDidMount() {
        require('bootswatch/dist/darkly/bootstrap.min.css')
        require('./Admin.css')
    }

    componentWillUnmount() {
      
    }
    
    render () {
        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <div className="d-flex justify-content-between">
                    <div className="stripes"></div>
                    <div className="stripes stripes-right"></div>
                </div>
                <AdminNavBar />
                <Switch>
                    <Route path="/admin/videos/list"  component={VideoList} />
                    <Route path="/admin/videos/create"  component={VideoInsert} />
                    <Route path="/admin/videos/update/:id" component={VideoUpdate} />
                    <Route path="/"  component={AdminPage} />
                </Switch>
                <Footer />
            </BrowserRouter>
        )    
    }
}

export default Admin;
