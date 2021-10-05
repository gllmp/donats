import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Role } from './utils';
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

//let data = [];
// /!\ get playlist from database
// let playlist = {
//   music: ["music"],
//   rap: ["rap"],
//   skate: ["skate"],
//   music_rap: ["music", "rap"],
//   music_skate: ["music", "skate"],
//   rap_skate: ["rap", "skate"]
// };

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: [],
      categories: [],
      swapElement: null,
      swapDirection: null,
      currentUser: null,
      isAdmin: false,
      isLoading: true
    };

    this.videoData = [];
    this.categoryData = [];

    this.parseVideoData = this.parseVideoData.bind(this);
    this.setVideosArray = this.setVideosArray.bind(this);
    this.parseVideosByCategory = this.parseVideosByCategory.bind(this);
    this.parseCategoryData = this.parseCategoryData.bind(this);
    this.setCategoriesArray = this.setCategoriesArray.bind(this);
    this.getDOMElements = this.getDOMElements.bind(this);
    this.handleSwap = this.handleSwap.bind(this);
    this.handleContactSwap = this.handleContactSwap.bind(this);
    this.handlePlayerSwap = this.handlePlayerSwap.bind(this);
    this.swapToPlayer = this.swapToPlayer.bind(this);
    this.swapToSlider = this.swapToSlider.bind(this);
    this.swapToContact = this.swapToContact.bind(this);
  }

  componentDidMount = async () => {
    this.sliderRef = React.createRef();
    this.videoPlayerRef = React.createRef();
    this.contactRef = React.createRef();

    authenticationService.currentUser.subscribe(x => this.setState({
      currentUser: x,
      isAdmin: x && x.role === Role.Admin
    }));

    if (this.props.appRoute === "/" ) {
      await new Promise(async (resolve, reject) => {

        this.parseVideoData(this.props.videoData);

        console.log("VIDEO DATA: ", this.videoData);
        
        resolve(this.videoData);
      }).then(async (videoData) => {
        
        this.parseCategoryData(this.props.categoryData);

        console.log("CATEGORY DATA: ", this.categoryData);
      }).then(async () => {

        await this.setState({
          videos: this.videoData,
          categories: this.categoryData,
          isLoading: false
        });
        
        console.log("LOADING FINISHED");
      }).catch((error) => {
        console.error(error);
      }).finally(() => {    
        this.getDOMElements();
      });
    } else if (this.props.appRoute.includes("/admin/videos")) {
      this.parseVideoData(this.props.videoData);

      this.setState({
        videos: this.videoData,
        isLoading: false
      });
    } else if (this.props.appRoute.includes("/admin/categories")) {
      this.parseCategoryData(this.props.categoryData);

      this.setState({
        categories: this.categoryData,
        isLoading: false
      });
    } else {
      this.setState({
        isLoading: false
      });
    }

  }

  componentWillUnmount() {

  }

  parseVideoData(videoData) {
    JSON.parse(videoData).forEach(async element => {
      await new Promise((resolve, reject) => {
        this.setVideosArray(this.videoData, element);

        resolve(this.videoData);
      }).then((videoData) => {
        this.parseVideosByCategory(videoData, element);
        
        return this.videoData;
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        //console.log("VIDEO DATA: ", this.videoData);
      });
    });
  }
  
  setVideosArray(videoData, videoItem) {
    videoData[videoItem.category.replace(/\s+/g, '-').toLowerCase()] = [];
  }

  parseVideosByCategory(videoData, videoItem) {
    Object.keys(videoData).forEach(category => {
      if (videoItem.category.replace(/\s+/g, '-').toLowerCase() === category) {
        videoData[category].push(videoItem);
      }
    })
  }

  parseCategoryData(categoryData) {
    categoryData.forEach(async element => {
      await new Promise((resolve, reject) => {
        this.setCategoriesArray(this.categoryData, element);

        resolve(this.categoryData);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        //console.log("CATEGORY DATA: ", this.categoryData);
      });
    });
  }

  setCategoriesArray(categoryData, categoryItem) {
    let categoryName = categoryItem.name.replace(/\s+/g, '-').toLowerCase();    

    categoryData[categoryName] = [];

    categoryItem.category.forEach(async element => {
      categoryData[categoryName].push(element.replace(/\s+/g, '-').toLowerCase());
    })
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

  getDOMElements() {
    this.swiperElement = document.getElementById("slider-container");
    this.playerElement = document.getElementById("player-container");
    this.videoPlayerElement = document.getElementById("video-player");
    this.randomButtonElement = document.getElementById("video-button");

    this.titleElement = document.getElementById("banner-title");
    this.infoElement = document.getElementById("banner-info");
    this.closeElement = document.getElementById("banner-close");

    this.contactElement = document.getElementById("contact-container");
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
        this.randomButtonElement.classList.add("fade-out");
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

  handlePlayerSwap = async () => {
    const videoIframe = this.videoPlayerElement.children[0].children[0];

    if (this.state.swapDirection === "open") {
      this.sliderRef.current.onCloseSlider();
      this.videoPlayerRef.current.onShowPlayer();

      await videoIframe.removeEventListener("animationend", this.swapToSlider());

      await new Promise((resolve, reject) => {
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

      this.randomButtonElement.style.display = "none";
  
      this.contactElement.classList.remove("fade-out");  
      this.closeElement.classList.remove("fade-out");
  
      this.contactElement.classList.add("fade-in");  
      this.closeElement.classList.add("fade-in");  
    }, swapDuration)
  }

  swapToPlayer() {
    const swapDuration = 600;

    const videoIframe = this.videoPlayerElement.children[0].children[0];

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

      this.randomButtonElement.style.display = "block";
  
      this.swiperElement.classList.remove("fade-out");
      this.titleElement.classList.remove("fade-out");
      this.infoElement.classList.remove("fade-out");

      this.randomButtonElement.classList.remove("fade-out");
  
      this.swiperElement.classList.add("fade-in");
      this.titleElement.classList.add("fade-in");
      this.infoElement.classList.add("fade-in");

      this.randomButtonElement.classList.add("fade-in");
    }, swapDuration)
  }

  logout() {
      authenticationService.logout();
  }

  render() {
    const { videos, categories, currentUser, isAdmin, isLoading } = this.state;

    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {!isLoading && (
          <Switch>
            <Route exact path="/">
              <BannerTop swapElement={this.state.swapElement} handleSwap={this.handleSwap} />
              <div className="App">
                <div className="app-container">
                  <div className="row">
                    <div className="col-lg">
                      <div className="align-items-center justify-content-center">
                        <ContactForm ref={this.contactRef} />
                        <Slider videos={videos} categories={this.props.categoryData} handleSwap={this.handleSwap} ref={this.sliderRef} />
                        <VideoPlayer videos={videos} categories={categories} ref={this.videoPlayerRef} slider={this.sliderRef} />
                        <RandomButton onClick={(e) => this.sliderRef.current.selectSlide(e.target)} />
                        {/* <button onClick={() => this.videoPlayerRef.current.onUpdateVideo()}>RANDOM</button> */}
                        <div className="landscape-subtitle">Le hasard fait bien les choses</div>
                        <Footer />
                      </div>
                    </div>
                  </div>
                </div>    
              </div>
            </Route>
            <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
            <Route path="/login">
              <div id="admin-container">
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
        )}
      </BrowserRouter>
    );
  }
}

export default App;