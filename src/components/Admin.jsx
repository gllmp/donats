import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AdminNavBar } from '../components';
import { AdminPage, VideoList, VideoInsert, VideoUpdate, CategoryList, CategoryInsert, CategoryUpdate } from '../pages';
import Footer from './Footer';

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    
    componentDidMount() {
        require('bootswatch/dist/darkly/bootstrap.min.css');
        require('./Admin.css');
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
                <div id="admin-container">
                    <Switch>
                        <Route path="/admin/videos/list"  component={VideoList} />
                        <Route path="/admin/videos/create"  component={VideoInsert} />
                        <Route path="/admin/videos/update/:id" component={VideoUpdate} />
                        <Route path="/admin/categories/list"  component={CategoryList} />
                        <Route path="/admin/categories/create"  component={CategoryInsert} />
                        <Route path="/admin/categories/update/:id"  component={CategoryUpdate} />
                        <Route path="/"  component={AdminPage} />
                    </Switch>

                    <Footer />
                </div>
            </BrowserRouter>
        )    
    }
}

export default Admin;
