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
      isLoading: false
    };

    this.videoData = [];
    this.categoryData = [];

    this.parseVideoData = this.parseVideoData.bind(this);
    this.setVideosArray = this.setVideosArray.bind(this);
    this.parseVideosByCategory = this.parseVideosByCategory.bind(this);
    this.parseCategoryData = this.parseCategoryData.bind(this);
    this.setCategoriesArray = this.setCategoriesArray.bind(this);
    this.parseCategoriesByCategory = this.parseCategoriesByCategory.bind(this);
    this.getDOMElements = this.getDOMElements.bind(this);
    this.handleSwap = this.handleSwap.bind(this);
    this.handleContactSwap = this.handleContactSwap.bind(this);
    this.handlePlayerSwap = this.handlePlayerSwap.bind(this);
    this.swapToPlayer = this.swapToPlayer.bind(this);
    this.swapToSlider = this.swapToSlider.bind(this);
    this.swapToContact = this.swapToContact.bind(this);
  }

  componentDidMount = async () => {

    // const loadingContainer = document.getElementById("loading-container");
    // loadingContainer.classList.add("fade-out");
    // loadingContainer.addEventListener("animationend", () => {
    //     loadingContainer.classList.add("hide");
   
    //     document.getElementById('root').classList.add("fade-in");
        
    //     ReactDOM.render(
    //         <App videoData={JSON.stringify(_videoData)} categoryData={_categoryData} appRoute={window.location.pathname} />,
    //         document.getElementById('root')
    //     );                    
    // });

    this.setState({
      isLoading: true
    });

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

        // let videoAndCategoryData = {
        //   videoData: videoData,
        //   categoryData: this.categoryData
        // }

        // return(videoAndCategoryData)
      }).then(async () => {

        await this.setState({
          videos: this.videoData,
          categories: this.categoryData,
          isLoading: false
        });
        
        console.log("LOADING FINISHED", this.state);
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
      // }).then((categoryData) => {
      //   this.parseCategoriesByCategory(categoryData, element);
        
      //   return this.categoryData;
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
    //categoryData[categoryName].push(categoryItem.category);

    categoryItem.category.forEach(async element => {
      categoryData[categoryName].push(element.replace(/\s+/g, '-').toLowerCase());
    })
  }
  
  parseCategoriesByCategory(categoryData, categoryItem) {
    let categoryName = categoryItem.name.replace(/\s+/g, '-').toLowerCase();

    // Object.keys(categoryData).forEach(category => {
    //   // if (item.category.replace(/\s+/g, '-').toLowerCase() === category) {
    //   //   _data[category].push(item);
    //   // }
    // })

    let categoriesArray = categoryData[categoryName][0];

    // categoriesArray.forEach(category => {
    //   //console.log(category)
    // })

    
    for (let i = 0; i < categoriesArray.length; i++) {
      //categoryData[categoryName][0][i] = String(categoryData[categoryName][0][i]).replace(/\s+/g, '-').toLowerCase()
    }

  }

  // parseCategoryData(categoryData) {
  //   categoryData.forEach(async element => {
  //     await new Promise((resolve, reject) => {
  //       this.setCategoriesArray(this.videoData, element);

  //       resolve(this.videoData);
  //     }).then((videoData) => {
  //       this.parseCategoriesByCategory(videoData, element);
        
  //       return this.videoData;
  //     }).catch((error) => {
  //       console.error(error);
  //     }).finally(() => {
  //       console.log("VIDEO DATA: ", this.videoData);
  //     });
  //   });

    // categoryData.forEach(element => {
    //   new Promise((resolve, reject) => {
    //     resolve();
    //   }).then(() => {
    //     //getCategories(data, element);
    //   }).then(() => {
    //     //parseItemsByCategory(data, element);        
    //   }).catch((error) => {
    //     console.error(error);
    //   }).finally(() => {
  
    //   });
    // })

    // await new Promise(async (resolve, reject) => {
    //   let categoryArray = [];

    //   categoryData.forEach(element => {
    //     categoryArray.push(element.name)
    //   });
  
    //   await this.setState({ 
    //     categories: categoryArray
    //   });
      
    //   resolve(this.state);
    // }).then((state) => {

    //   console.log("CATEGORY DATA: ", this.state.categories);
    // }).catch((error) => {
    //   console.error(error);
    // }).finally(() => {
      
    // });  




    // await this.setState({
    //   categories: categoryData
    // })

    // console.log("CATEGORY DATA: ", this.state.categories);




    // await new Promise(async (resolve, reject) => {
    //   let playlistArray = [];

    //   await categoryData.forEach(categoryElement => {

    //     playlistArray[categoryElement.name.replace(/\s+/g, '-').toLowerCase()] = [];
    //   });

    //   await Object.keys(playlistArray).forEach(playlistElement => {
    //     categoryData.forEach(categoryElement => {
    //       console.log(categoryElement)
    //     })
    //   })

    //   await this.setState({ 
    //     playlists: playlistArray
    //   });
      
    //   resolve(this.state);
    // }).then((state) => {

    //   console.log("PLAYLIST DATA: ", this.state.playlists);
    // }).catch((error) => {
    //   console.error(error);
    // }).finally(() => {
      
    // });



    // let categories = categoryData;

    // await new Promise(async (resolve, reject) => {
    //     let categoriesArray = [];

    //     categories.forEach(categoryElement => {

    //         categoriesArray[categoryElement.name.replace(/\s+/g, '-').toLowerCase()] = categoryElement.category;
    //     });

    //     resolve(categoriesArray);
    
    // }).then((categoriesArray) => {

    //     console.log(Object.keys(categoriesArray));

        

    //     // await Object.keys(categoriesArray).forEach(playlistElement => {
    //     //     categories.forEach(categoryElement => {
    //     //         //console.log(categoryElement)

    //     //     })
    //     // })

    //     // await this.setState({ 
    //     //     playlists: playlistArray
    //     // });
        
    //     //resolve(this.state);
    // }).then(() => {

    // }).catch((error) => {
    //     console.error(error);
    // }).finally(() => {
    //   console.log("CATEGORY DATA: ", categoryData);
    // });
//  }

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
    this.swiperElement = document.getElementsByClassName("swiper-container")[0];
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

  handlePlayerSwap() {
    const videoIframe = this.videoPlayerElement.children[0].children[0];

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
      </BrowserRouter>
    );
  }
}

export default App;