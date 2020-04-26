import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import deuspiCover from '../assets/img/deuspi-cover.png';
import categoryCover from '../assets/img/category-cover.png';
    
class Slider extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        swiper: null,
        currentSlide: null,
        showSlider: true,
        isClicked: false,
      };
              
      this.params = {
        slidesPerView: 3,
        spaceBetween: 40,
        speed: 300,
        initialSlide: 2,
        centeredSlides: true,
        prevenClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: true,
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
            if (event.target.tagName === 'IMG') {
              this.setState({
                currentSlide: event.target,
                isClicked: true
              });

              let url = this.state.currentSlide.getAttribute("data-url");
              if (url !== null) {
                // go to special site
                window.location.href = url;
              } else if (this.state.isClicked && this.state.currentSlide && this.state.swiper.isBeginning) {
                // if first slide
                this.onSlideClick();
              } else if (this.state.isClicked && this.state.currentSlide && this.state.swiper.isEnd) {
                // if last slide
                this.onSlideClick();
              }
            }
          },
          transitionEnd: () => {
            if((this.state.isClicked && this.state.currentSlide)) {
              this.onSlideClick();
            }
          }
        }      
      }

      this.onShowSlider = this.onShowSlider.bind(this);
      this.onCloseSlider = this.onCloseSlider.bind(this);
      this.onSlideClick = this.onSlideClick.bind(this);
      this.updateSwiper = this.updateSwiper.bind(this);
      //this.goNext = this.goNext.bind(this);
      //this.goPrev = this.goPrev.bind(this);
      this.setSlidesTransform = this.setSlidesTransform.bind(this);
      this.getComputedTranslateZ = this.getComputedTranslateZ.bind(this);
      //this.getSlideClickEvent = this.getSlideClickEvent.bind(this);
    }
    
    componentDidMount() {
      this.setSlidesTransform();

      // fix click on duplicate slides
      //this.getSlideClickEvent();
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

    onSlideClick() {
      this.setState({
        isClicked: false
      });        

      new Promise((resolve, reject) => {
        resolve();
      }).then(() => {
        // get playlist
        let playlist = this.state.currentSlide.getAttribute("data-playlist");
        console.log("PLAYLIST: ", playlist);
      }).then(() => {
        // swap slider with video player
        this.props.handleSwap("open");
      }).catch(() => {
    
      }).finally(() => {
    
      });        
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

    // getSlideClickEvent() {
    //   let swiperWrapper = document.querySelector('.swiper-wrapper');
    
    //   swiperWrapper.addEventListener('click', function(event) {
    //       if (event.target.tagName === 'IMG') {
    //         let slideElement = event.target;
            
    //         let playlist = slideElement.getAttribute("data-playlist");
    //         console.log(playlist);
    
    //         let url = slideElement.getAttribute("data-url");
    
    //         if (url === null) {
    //           // mount video player
    //           new Promise((resolve, reject) => {
    //             resolve();
    //           }).then(() => {
                  
    //           }).then(() => {
                  
    //           }).then(() => {
                  
    //           }).catch(() => {
            
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

        return (
          <div>
            <Swiper getSwiper={this.updateSwiper} {...this.params}>
                <div><img className="swiper-slide-image" data-playlist="music" src={categoryCover} alt="category cover" /></div>
                <div><img className="swiper-slide-image" data-playlist="rap" src={categoryCover} alt="category cover" /></div>
                <div><img className="swiper-slide-image" data-playlist="deuspi" data-url="http://deuspi.biz/" src={deuspiCover} alt="deuspi cover" /></div>
                <div><img className="swiper-slide-image" data-playlist="skate" src={categoryCover} alt="category cover" /></div>
                <div><img className="swiper-slide-image" data-playlist="category" src={categoryCover} alt="category cover" /></div>
            </Swiper>
            {/* <button onClick={this.goPrev}>Prev</button>
            <button onClick={this.goNext}>Next</button> */}
          </div>
        )
    }
  };

export default Slider;