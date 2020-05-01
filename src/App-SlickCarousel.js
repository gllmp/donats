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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Carousel from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';

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

function SliderNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}

function SliderPrevArrow(props) {
  const { className, style, onClick } = props;

  return (
    <div
      className={className}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}

// class MyCarousel extends React.Component {
//   render() {
//     return (
//       <Carousel
//         slidesPerPage={3}
//         slidesPerScroll={1}
//         offset={325}
//         arrows
//         infinite
//         keepDirectionWhenDragging
//       >
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//         <img src={deuspiCover} alt="deuspi cover" />
//       </Carousel>
//     );
//   }
// }

class VideoSlider extends React.Component {
  render() {
    var settings = {
      className: "video-slider",
      dots: false,
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 3,
      slidesToScroll: 1,
      swipeToSlide: true,
      adaptiveHeight: true,
      variableWidth: false,
      nextArrow: <SliderNextArrow />,
      prevArrow: <SliderPrevArrow />,
      speed: 500
    };
    return (
      <Slider {...settings}>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
          <div>
            <h3>7</h3>
          </div>
          <div>
            <h3>8</h3>
          </div>
      </Slider>
    );
  }
}

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
                    <VideoSlider />
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