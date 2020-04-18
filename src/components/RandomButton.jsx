import React from 'react';
import  nextButtonImage from '../assets/img/button-next.gif';

class RandomButton extends React.Component {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
      console.log('Click happened');
    }
    componentDidMount() {
  
    }
    componentWillUnmount() {
      
    }
    render() {
      return (
        <div id="video-button-container">
          <button id="video-button" onClick={this.props.onClick}>
            <img id="video-button-img" src={nextButtonImage} width="164" height="80" alt=""/>
          </button>
        </div>
      );
    }
  }

  export default RandomButton;