import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Role } from './helpers';
import { authenticationService } from './services';
import { LoginPage } from './pages';
import { PrivateRoute } from './components/PrivateRoute';
import Admin from './components/Admin';
import BannerTop from './components/BannerTop';
import ContactForm from './components/ContactForm';
import Slider from './components/Slider';
import VideoPlayer from './components/VideoPlayer';
import RandomButton from './components/RandomButton';
import Footer from './components/Footer';
import './App.css';

let data = [];
// /!\ get playlist from database
let playlist = {
  music: ["music"],
  rap: ["rap"],
  skate: ["skate"],
  music_rap: ["music", "rap"],
  music_skate: ["music", "skate"],
  rap_skate: ["rap", "skate"]
};

function parseData(appData) {
  JSON.parse(appData).forEach(element => {
    new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      getCategories(data, element);
    }).then(() => {
      parseItemsByCategory(data, element);        
    }).catch((error) => {
      console.error(error);
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
      isAdmin: false,
      swapElement: null,
      swapDirection: null
    };

    this.handleSwap = this.handleSwap.bind(this);
    this.handleContactSwap = this.handleContactSwap.bind(this);
    this.handlePlayerSwap = this.handlePlayerSwap.bind(this);
    this.swapToPlayer = this.swapToPlayer.bind(this);
    this.swapToSlider = this.swapToSlider.bind(this);
    this.swapToContact = this.swapToContact.bind(this);
  }

  componentDidMount() {
    parseData(this.props.appData);

    authenticationService.currentUser.subscribe(x => this.setState({
      currentUser: x,
      isAdmin: x && x.role === Role.Admin
    }));

    this.sliderRef = React.createRef();
    this.videoPlayerRef = React.createRef();
    this.contactRef = React.createRef();

    this.swiperElement = document.getElementsByClassName("swiper-container")[0];
    this.playerElement = document.getElementById("player-container");

    this.videoPlayer = document.getElementById("video-player");

    this.titleElement = document.getElementById("banner-title");
    this.infoElement = document.getElementById("banner-info");
    this.closeElement = document.getElementById("banner-close");

    this.contactElement = document.getElementById("contact-container");
  }

  handleSwap(element, direction) {
    new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      this.setState({
        swapElement: element,
        swapDirection: direction
      });  
    }).then(() => {
      if (this.state.swapElement === "slider") {
        this.handlePlayerSwap();
      } else if (this.state.swapElement === "contact") {
        this.handleContactSwap();
      }  
    }).catch((error) => {
        console.error(error);
    }).finally(() => {
      
    });  
  }

  handleContactSwap() {
    if (this.state.swapDirection === "open") {
      this.sliderRef.current.onCloseSlider();
      this.contactRef.current.onShowContact();

      this.contactElement.removeEventListener("animationend", this.swapToSlider());

      new Promise((resolve, reject) => {
        resolve();
      }).then(() => {
        this.swiperElement.classList.add("fade-out");
        this.titleElement.classList.add("fade-out");
        this.infoElement.classList.add("fade-out");  
      }).then(() => {
        this.swiperElement.addEventListener("animationend", this.swapToContact());  
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        
      });  
    } else if (this.state.swapDirection === "close") {
      this.contactRef.current.onCloseContact();
      this.sliderRef.current.onShowSlider();

      this.swiperElement.removeEventListener("animationend", this.swapToContact());

      new Promise((resolve, reject) => {
        resolve();
      }).then(() => {
        this.contactElement.classList.add("fade-out");
        this.closeElement.classList.add("fade-out");
        
        this.contactElement.addEventListener("animationend", this.swapToSlider());  
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        
      });  
    }
  }

  handlePlayerSwap() {
    const videoIframe = this.videoPlayer.children[0].children[0];

    if (this.state.swapDirection === "open") {
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
        this.swiperElement.addEventListener("animationend", this.swapToPlayer());  
      }).then(() => {
        this.videoPlayerRef.current.onUpdateVideo();
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        
      });  
    } else if (this.state.swapDirection === "close") {
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
        
        videoIframe.addEventListener("animationend", this.swapToSlider());  
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        
      });  
    }
  }

  swapToContact() {
    const swapDuration = 600;

    setTimeout(() => {
      this.swiperElement.style.display = "none";
      this.contactElement.style.display = "table";  
      
      this.titleElement.style.display = "none";
      this.infoElement.style.display = "none";
      this.closeElement.style.display = "block";  
  
      this.contactElement.classList.remove("fade-out");  
      this.closeElement.classList.remove("fade-out");
  
      this.contactElement.classList.add("fade-in");  
      this.closeElement.classList.add("fade-in");  
    }, swapDuration)
  }

  swapToPlayer() {
    const swapDuration = 600;

    const videoIframe = this.videoPlayer.children[0].children[0];

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

    setTimeout(() => {
      this.contactElement.style.display = "none";  
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
            <BannerTop swapElement={this.state.swapElement} handleSwap={this.handleSwap} />
            <div className="App">
              <div className="app-container">
                <div className="row">
                  <div className="col-lg">
                    <div className="align-items-center justify-content-center">
                      <ContactForm ref={this.contactRef} />
                      <Slider handleSwap={this.handleSwap} ref={this.sliderRef} />
                      <VideoPlayer data={data} playlist={playlist} ref={this.videoPlayerRef} slider={this.sliderRef} />
                      <RandomButton onClick={(e) => this.sliderRef.current.selectSlide(e.target)} />
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
            <div className="admin-container">
              {currentUser &&
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <div className="navbar-nav">
                        <Link to="/login" className="nav-item nav-link">Login</Link>
                        {isAdmin && <Link to="/admin" className="nav-item nav-link">Admin</Link>}
                    </div>
                </nav>
              }
              {/* <PrivateRoute exact path="/" component={HomePage} /> */}
              <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
              <Route path="/login" component={LoginPage} />
              <Footer />
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;