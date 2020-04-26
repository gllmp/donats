import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Role } from './helpers';
import { authenticationService } from './services';
import { LoginPage } from './pages';
import { PrivateRoute } from './components/PrivateRoute';
import Admin from './components/Admin';
import BannerTop from './components/BannerTop';
import Slider from './components/Slider';
import VideoPlayer from './components/VideoPlayer';
import Footer from './components/Footer';
import './App.css';

let data = [];

function parseData(appData) {
  JSON.parse(appData).forEach(element => {
    new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      getCategories(data, element);
    }).then(() => {
      parseItemsByCategory(data, element);        
    }).catch(() => {

    }).finally(() => {

    });
  })

  console.log("DATA: ", data);
}

function getCategories(_data, item) {
  if (item.category !== Object.keys(_data)) {
    _data[item.category.toLowerCase()] = [];
  }
}

function parseItemsByCategory(_data, item) {
  Object.keys(_data).forEach(category => {
    if (item.category.toLowerCase() === category) {
      _data[category].push(item);
    }
  })
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false
    };

    this.sliderRef = React.createRef();
    this.videoPlayerRef = React.createRef();

    this.handleSwap = this.handleSwap.bind(this);
    this.swapToPlayer = this.swapToPlayer.bind(this);
    this.swapToSlider = this.swapToSlider.bind(this);
  }

  componentDidMount() {
    parseData(this.props.appData);

    authenticationService.currentUser.subscribe(x => this.setState({
      currentUser: x,
      isAdmin: x && x.role === Role.Admin
    }));

    this.swiperElement = document.getElementsByClassName("swiper-container")[0];
    this.playerElement = document.getElementById("player-container");

    this.videoPlayer = document.getElementById("video-player");
    //this.videoIframe = this.videoPlayer.children[0].children[0];

    this.titleElement = document.getElementById("banner-title");
    this.infoElement = document.getElementById("banner-info");
    this.closeElement = document.getElementById("banner-close");
  }

  handleSwap(swap) {
    const swapDirection = swap;

    const videoIframe = this.videoPlayer.children[0].children[0];

    if (swapDirection === "open") {
      this.sliderRef.current.onCloseSlider();
      this.videoPlayerRef.current.onShowPlayer();

      videoIframe.removeEventListener("animationend", this.swapToSlider());

      new Promise((resolve, reject) => {
        resolve();
      }).then(() => {
        this.swiperElement.classList.add("fade-out");
        this.titleElement.classList.add("fade-out");
        this.infoElement.classList.add("fade-out");  
      }).then(() => {
        //videoIframe.removeEventListener("animationend", this.swapToSlider());
        this.swiperElement.addEventListener("animationend", this.swapToPlayer());  
      }).then(() => {
        this.videoPlayerRef.current.onUpdateVideo();
      }).catch(() => {
  
      }).finally(() => {
        
      });  
    } else if (swapDirection === "close") {
      this.videoPlayerRef.current.onClosePlayer();
      this.sliderRef.current.onShowSlider();

      this.swiperElement.removeEventListener("animationend", this.swapToPlayer());

      new Promise((resolve, reject) => {
        resolve();
      }).then(() => {
        this.videoPlayerRef.current.onPauseVideo();
      }).then(() => {
        videoIframe.classList.add("fade-out");
        this.playerElement.classList.add("fade-out");
        this.closeElement.classList.add("fade-out");
        
        //this.swiperElement.removeEventListener("animationend", this.swapToPlayer());
        videoIframe.addEventListener("animationend", this.swapToSlider());  
      }).catch(() => {
  
      }).finally(() => {
        
      });  
    }

  }

  swapToPlayer() {
    const swapDuration = 600;

    //const swiperElement = document.getElementsByClassName("swiper-container")[0];
    //const playerElement = document.getElementById("player-container");

    //const videoPlayer = document.getElementById("video-player");
    const videoIframe = this.videoPlayer.children[0].children[0];

    //const titleElement = document.getElementById("banner-title");
    //const infoElement = document.getElementById("banner-info");
    //const closeElement = document.getElementById("banner-close");

    setTimeout(() => {
      this.swiperElement.style.display = "none";
      this.playerElement.style.display = "block";  
      
      this.titleElement.style.display = "none";
      this.infoElement.style.display = "none";
      this.closeElement.style.display = "block";  
  
      videoIframe.classList.remove("fade-out");
      this.playerElement.classList.remove("fade-out");  
      this.closeElement.classList.remove("fade-out");
  
      videoIframe.classList.add("fade-in");
      this.playerElement.classList.add("fade-in");  
      this.closeElement.classList.add("fade-in");  
    }, swapDuration)
}

  swapToSlider() {
    const swapDuration = 600;

    //const swiperElement = document.getElementsByClassName("swiper-container")[0];
    //const playerElement = document.getElementById("player-container");

    //const titleElement = document.getElementById("banner-title");
    //const infoElement = document.getElementById("banner-info");
    //const closeElement = document.getElementById("banner-close");

    setTimeout(() => {
      this.playerElement.style.display = "none";  
      this.swiperElement.style.display = "block";
  
      this.closeElement.style.display = "none";
      this.titleElement.style.display = "block";
      this.infoElement.style.display = "block";
  
      this.swiperElement.classList.remove("fade-out");
      this.titleElement.classList.remove("fade-out");
      this.infoElement.classList.remove("fade-out");
  
      this.swiperElement.classList.add("fade-in");
      this.titleElement.classList.add("fade-in");
      this.infoElement.classList.add("fade-in");
    }, swapDuration)
  }

  logout() {
      authenticationService.logout();
  }

  render() {
    const { currentUser, isAdmin } = this.state;

    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/">
            <BannerTop handleSwap={this.handleSwap} />
            <div className="App">
              <div className="app-container">
                <div className="row">
                  <div className="col-lg">
                    <div className="align-items-center justify-content-center">
                      <Slider handleSwap={this.handleSwap} ref={this.sliderRef} />
                      <VideoPlayer data={data} ref={this.videoPlayerRef} />
                      {/* <button onClick={() => this.videoPlayerRef.current.onUpdateVideo()}>RANDOM</button> */}
                      <Footer />
                    </div>
                  </div>
                </div>
              </div>    
            </div>
          </Route>
          <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
          <Route path="/login">
            <div>
                {currentUser &&
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        <div className="navbar-nav">
                            <Link to="/login" className="nav-item nav-link">Login</Link>
                            {isAdmin && <Link to="/admin" className="nav-item nav-link">Admin</Link>}
                        </div>
                    </nav>
                }
                <div className="jumbotron">
                    <div className="container">
                        <div className="row">
                            <div className="login-container col-sm-4 offset-md-4">
                                {/* <PrivateRoute exact path="/" component={HomePage} /> */}
                                <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
                                <Route path="/login" component={LoginPage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;