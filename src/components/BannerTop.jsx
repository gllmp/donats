import React, { Component } from 'react';
import  infoIcon from '../assets/img/info-icon.png';

class BannerTop extends Component {
    render() {
        return (
            <nav id="banner-top" className="navbar navbar-expand-lg">
              <a id="link-title" className="navbar-nav mr-auto navbar-brand" href="/">DONATS</a>
              <div id="link-info" className="navbar-nav ml-auto"><img src={infoIcon} alt="info icon" /></div>
            </nav>
        )
    }
}

export default BannerTop;
