import React from 'react';
import  infoIcon from '../assets/img/info-icon.png';
import  closeIcon from '../assets/img/close-icon.png';

class BannerTop extends React.Component {
    constructor(props) {
        super(props);

        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
    
    }

    onClose() {
        this.props.handleSwap("close");
    }

    render() {
        return (
            <nav id="banner-top" className="navbar navbar-expand-lg">
              <a id="banner-title" className="navbar-nav mr-auto navbar-brand" href="/">DONATS</a>
              <div id="banner-info" className="navbar-nav ml-auto"><img src={infoIcon} alt="info icon" /></div>
              <div id="banner-close" className="navbar-nav ml-auto" onClick={this.onClose}><img src={closeIcon} alt="close icon" /></div>
            </nav>
        )
    }
}

export default BannerTop;
