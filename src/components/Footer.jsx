import React, { Component } from 'react';

class Footer extends Component {
    render() {
        const year = String(new Date().getFullYear());

        return (
            <div id="footer">
                <p>&copy;{year}, <a href="http://donats.net/" target="_blank" rel="noopener noreferrer">DONATS | KILL THE QUARANTINE</a></p>
            </div>
  )
    }
}

export default Footer;
