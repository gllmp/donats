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
  }

  componentDidMount() {
    parseData(this.props.appData);

    authenticationService.currentUser.subscribe(x => this.setState({
      currentUser: x,
      isAdmin: x && x.role === Role.Admin
    }));
  }

  handleSwap() {
    const swiperElement = document.getElementsByClassName("swiper-container")[0];
    const playerElement = document.getElementById("player-container");

    const videoPlayer = document.getElementById("video-player");
    const videoIframe = videoPlayer.children[0].children[0]; 

    new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      swiperElement.classList.add("fade-out");

      swiperElement.addEventListener("animationend", () => {
        swiperElement.style.display = "none";
        playerElement.style.display = "block";  
      });  
    }).then(() => {
      videoIframe.classList.add("fade-in");  
    }).then(() => {
      this.videoPlayerRef.current.onUpdateVideo();
    }).catch(() => {

    }).finally(() => {

    });
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