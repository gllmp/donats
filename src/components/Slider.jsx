import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import deuspiCover from '../assets/img/deuspi-cover.png';
import categoryCover from '../assets/img/category-cover.png';
import culturaCover from '../assets/img/cultura-cover.png';
import curiosityCover from '../assets/img/curiosity-cover.png';
import filmParfaitCover from '../assets/img/film-parfait-cover.png';
import laGrailleCover from '../assets/img/la-graille-cover.png';
import radiovisionCover from '../assets/img/radiovision-cover.png';


class Slider extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        swiper: null,
        categories: null,
        category: null,
        covers: [],
        showSlider: true,
        currentSlide: null,
      };
              
      this.params = {
        slidesPerView: 3,
        spaceBetween: 40,
        speed: 300,
        initialSlide: 2,
        centeredSlides: true,
        prevenClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        loop: false,
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
        },
        on: {
          init: () => {
            console.log("INIT SWIPER");
          },
          // reachBeginning: () => {
          //   this.state.swiper.slideTo(this.state.swiper.slides.length-1);
          // },
          click: (event) => {
            this.selectSlide(event.target);
          }
        }      
      }

      this.onShowSlider = this.onShowSlider.bind(this);
      this.onCloseSlider = this.onCloseSlider.bind(this);
      this.updateSwiper = this.updateSwiper.bind(this);
      this.selectSlide = this.selectSlide.bind(this);
      this.slideAndSwap = this.slideAndSwap.bind(this);
      this.setSlidesTransform = this.setSlidesTransform.bind(this);
      this.getComputedTranslateZ = this.getComputedTranslateZ.bind(this);
      //this.goNext = this.goNext.bind(this);
      //this.goPrev = this.goPrev.bind(this);
      //this.getSlideClickEvent = this.getSlideClickEvent.bind(this);
    }
    
    componentDidMount = async () => {
      await this.setState({ 
        categories: this.props.categories 
      });

      this.setSlidesTransform();
      
      // fix click on duplicate slides
      //this.getSlideClickEvent();

      await new Promise(async (resolve, reject) => {

        resolve(this.state.categories);
      }).then(async (categories) => {        
        const categoriesCovers = categories.map((category) =>
          <div key={category.name.toString()}>
              <img className="swiper-slide-image" data-category={category.name.toLowerCase()} data-url={category.url} src={category.cover} alt="category cover" />
          </div>
        );

        // const categoriesWithUrl = categories.filter((category) => 
        //   category.url.length > 0
        // );

        await this.setState({ 
            covers: categoriesCovers
        });

        console.log("COVERS LOADED: ", this.state.covers);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.state.swiper.update();
      });
  }

    componentWillUnmount() {

    }

    onShowSlider() {
      this.setState({
          showSlider: true
      });
    }

    onCloseSlider() {
        this.setState({
          showSlider: false
        });
    }

    updateSwiper(swiper) {
      this.setState({ swiper });
    }

    selectSlide(target) {
      if (target.id === "video-button-img" && this.state.showSlider) {
        // select random slide
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          let sliderImages = document.getElementsByClassName("swiper-slide-image");

          let index = Math.floor(Math.random() * Object.keys(sliderImages).length);
          
          let swiperDuplicate = this.state.swiper;
          swiperDuplicate.clickedIndex = index;

          this.setState({
            currentSlide: sliderImages[index],
            swiper: swiperDuplicate
          });

          //this.state.swiper.clickedIndex = index;
        }).then(() => {
          this.slideAndSwap();
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
      
        });            
      } else if ((target.classList.contains("swiper-slide-image")) || (target.id === "video-button-img" && !this.state.showSlider)) {       
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          if (target.classList.contains("swiper-slide-image")) {
            this.setState({
              currentSlide: target,
            });  
          }
        }).then(() => {
          this.slideAndSwap();
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
      
        });                   
      }
    }

    slideAndSwap() {
      let url = this.state.currentSlide.getAttribute("data-url");

      if (url.length > 0) {
        // go to special site
        window.location.href = url;
      } else {
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          // get category
          this.setState({
            category: this.state.currentSlide.getAttribute("data-category")
          })
        }).then(() => {
          this.state.swiper.slideTo(this.state.swiper.clickedIndex);
        }).then(() => {
          // swap slider with video player
          setTimeout(() => {
            this.props.handleSwap("slider", "open");
          }, this.params.speed)
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
      
        });            
      }
    }

    setSlidesTransform() {
      let slides = document.getElementsByClassName("swiper-slide");
      let scale = 1.05;
      
      [].forEach.call(slides, slide => {
          slide.onmouseover = () => {
          let translateZ = this.getComputedTranslateZ(slide);
  
          slide.style.transform = "translate3d(0px, 0px, " + String(translateZ) +  "px) rotateX(0deg) rotateY(0deg) scale(" + scale + ")";
          slide.style.transitionDuration = "300ms";
          }
  
          slide.onmouseout = () => {
          let translateZ = this.getComputedTranslateZ(slide);
  
          slide.style.transform = "translate3d(0px, 0px, " + String(translateZ) +  "px) rotateX(0deg) rotateY(0deg) scale(1)";
          }
      });
    }

    getComputedTranslateZ(el) {
      if(!window.getComputedStyle) return;
      
      let style = getComputedStyle(el);
      let transform = style.transform || style.webkitTransform || style.mozTransform;
      let mat = transform.match(/^matrix3d\((.+)\)$/);
  
      return mat ? ~~(mat[1].split(', ')[14]) : 0;
    }

    // goNext() {
    //   if (this.state.swiper !== null) {
    //     this.state.swiper.slideNext();
    //   }
    // };
    
    // goPrev() {
    //   if (this.state.swiper !== null) {
    //     this.state.swiper.slidePrev();
    //   }
    // };

    // getSlideClickEvent() {
    //   let swiperWrapper = document.querySelector('.swiper-wrapper');
    
    //   swiperWrapper.addEventListener('click', function(event) {
    //       if (event.target.tagName === 'IMG') {
    //         let slideElement = event.target;
            
    //         let playlist = slideElement.getAttribute("data-category");
    //         console.log(playlist);
    
    //         let url = slideElement.getAttribute("data-url");
    
    //         if (url === null) {
    //           // mount video player
    //           new Promise((resolve, reject) => {
    //              resolve();
    //           }).then(() => {
                  
    //           }).then(() => {
                  
    //           }).then(() => {
                  
    //           }).catch((error) => {
    //              console.error(error);
    //           }).finally(() => {
            
    //           });        
    //         } else {
    //           // go to special site
    //           window.location.href = url;
    //         }
    //       }
    //   });  
    // }

    render() {
      const {covers} = this.state;

      return (
        // <div id="slider-container">
        //   <Swiper getSwiper={this.updateSwiper} {...this.params}>
        //       <div><img className="swiper-slide-image" data-category="music" data-url="" src={culturaCover} alt="category cover" /></div>
        //       <div><img className="swiper-slide-image" data-category="rap" data-url="" src={curiosityCover} alt="category cover" /></div>
        //       <div><img className="swiper-slide-image" data-category="deuspi" data-url="http://deuspi.biz/" src={deuspiCover} alt="deuspi cover" /></div>
        //       <div><img className="swiper-slide-image" data-category="music_rap" data-url="" src={filmParfaitCover} alt="category cover" /></div>
        //       <div><img className="swiper-slide-image" data-category="music_skate" data-url="" src={laGrailleCover} alt="category cover" /></div>
        //       <div><img className="swiper-slide-image" data-category="rap_skate" data-url="" src={radiovisionCover} alt="category cover" /></div>
        //   </Swiper>
        //   {/* <button onClick={this.goPrev}>Prev</button>
        //   <button onClick={this.goNext}>Next</button> */}
        // </div>

        <div id="slider-container">
          <div className="row">
            <div className="col-lg">
              <div className="align-items-center justify-content-center">                                    
                <Swiper getSwiper={this.updateSwiper} {...this.params}>
                  {covers}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

export default Slider;