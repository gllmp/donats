import React, { Component } from 'react';

class Footer extends Component {
    render() {
        const year = String(new Date().getFullYear());

        return (
            <div id="footer">
                <p><span id="copyright-symbol">&copy;</span>{year}, <a href="http://donats.net/" rel="noopener noreferrer">DONATS</a></p>
            </div>
  )
    }
}

export default Footer;
