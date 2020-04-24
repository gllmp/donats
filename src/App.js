import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Role } from './helpers';
import { authenticationService } from './services';
import { LoginPage } from './pages';
import { PrivateRoute } from './components/PrivateRoute';
import Admin from './components/Admin';
import VideoPlayer from './components/VideoPlayer';
import Footer from './components/Footer';
import './App.css';
import  infoIcon from './assets/img/info-icon.png';
import deuspiCover from './assets/img/deuspi-cover.png';
import categoryCover from './assets/img/category-cover.png';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';

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

function setSlidesTransform() {
  let slides = document.getElementsByClassName("swiper-slide");
  
  [].forEach.call(slides, slide => {

    slide.onmouseover = () => {
      let translateZ = getComputedTranslateZ(slide);

      slide.style.transform = "translate3d(0px, 0px, " + String(translateZ) +  "px) rotateX(0deg) rotateY(0deg) scale(1.1)";
      slide.style.transitionDuration = "300ms";
    }

    slide.onmouseout = () => {
      let translateZ = getComputedTranslateZ(slide);
      
      slide.style.transform = "translate3d(0px, 0px, " + String(translateZ) +  "px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  });
}

function getComputedTranslateZ(el) {
    if(!window.getComputedStyle) return;
    
    let style = getComputedStyle(el);
    let transform = style.transform || style.webkitTransform || style.mozTransform;
    let mat = transform.match(/^matrix3d\((.+)\)$/);

    return mat ? ~~(mat[1].split(', ')[14]) : 0;
}

function getSlideClickEvent() {
  let swiperWrapper = document.querySelector('.swiper-wrapper');
  swiperWrapper.addEventListener('click', function(event) {
      if (event.target.tagName === 'IMG') {
        let slideElement = event.target;
        let playlist = slideElement.getAttribute("data-playlist");
        console.log(playlist);
      
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
            
        }).then(() => {
            
        }).then(() => {
            
        }).catch(() => {
      
        }).finally(() => {
      
        });      
      }
  });  
}

const MutipleSlidesPerView = () => {
  const params = {
    slidesPerView: 3,
    spaceBetween: 40,
    speed: 300,
    centeredSlides: true,
    prevenClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: true,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true,
    //   dynamicBullets: true
    // },
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    },
    zoom: {
      maxRatio: 1.1,
      toggle: false
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 2,
        spaceBetween: 10
      }
    }
  }

  return (
    <Swiper {...params}>
      <div><img className="swiper-slide-image" data-playlist="deuspi" src={deuspiCover} alt="deuspi cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="aaaaaaa" src={categoryCover} alt="category cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="bbbbbbb" src={categoryCover} alt="category cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="ccccccc" src={categoryCover} alt="category cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="ddddddd" src={categoryCover} alt="category cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="eeeeeee" src={categoryCover} alt="category cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="fffffff" src={categoryCover} alt="category cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="ggggggg" src={categoryCover} alt="category cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="hhhhhhh" src={categoryCover} alt="category cover" /></div>
      <div><img className="swiper-slide-image" data-playlist="iiiiiii" src={categoryCover} alt="category cover" /></div>
    </Swiper>
  )
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false
    };

    this.videoPlayerRef = React.createRef();
  }

  componentDidMount() {
    parseData(this.props.appData);

    setSlidesTransform();

    // fix click on duplicate slides
    getSlideClickEvent();

    authenticationService.currentUser.subscribe(x => this.setState({
      currentUser: x,
      isAdmin: x && x.role === Role.Admin
    }));
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
            <nav id="banner-top" className="navbar navbar-expand-lg">
              <a id="link-title" className="navbar-nav mr-auto navbar-brand" href="/">DONATS</a>
              <a id="link-info" className="navbar-nav ml-auto" href="/"><img src={infoIcon} alt="info icon" /></a>
            </nav>
            <div className="App">
              <div className="app-container">
                <div className="row">
                  <div className="col-lg">
                    <MutipleSlidesPerView />
                    {/* <VideoPlayer data={data} ref={this.videoPlayerRef} /> */}
                    {/* <button onClick={() => this.videoPlayerRef.current.onUpdateVideo()}>RANDOM</button> */}
                    <Footer />
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