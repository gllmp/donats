import React from 'react';
import YouTube from 'react-youtube';
import RandomButton from './RandomButton';
import  deuspiImage from '../assets/img/deuspi-visual.png';

let category;

function setCategory(data) {
    
    let index = Math.floor(Math.random() * Object.keys(data).length);
    
    category = Object.keys(data)[index];
}

function setRandomId(data) {
    // set data category
    let dataCategory = data[category];

    // set video index
    let videoIndex;
    const videoLength = dataCategory.length;

    videoIndex = Math.floor(Math.random() * videoLength);

    // shuffle category array
    let randomArray = dataCategory;

    shuffleId(randomArray)

    // set video title
    let videoTitle;
    let videoId;

    videoTitle = randomArray[videoIndex].title;
    //console.log("videoTitle: ", videoTitle);

    // set video id
    videoId = randomArray[videoIndex].url;
    //console.log("videoId: ", videoId);

    let videoData = {
        category: category,
        title: videoTitle,
        id: videoId
    };
    console.log(videoData);

    return videoData;
}

function shuffleId(array) {
    // set random id using Fisher-Yates shuffle
    // see Mike Bostock article: https://bost.ocks.org/mike/shuffle/
    let i = array.length;
    let j, t;

    while (i) {
        j = Math.floor(Math.random() * i--);
        t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
    //console.log("shuffle: ", array);
    return array;
}

// function setViews() {
//   let categoryName = category;

//   let views = data.category[categoryName].views;
//   //console.log(views);
// }

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.showPlayer = false;
        this.youtubePlayerRef = React.createRef();

        this.state = {
            videoId: "",
            player: null,
        };

        this.onReady = this.onReady.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onPlayVideo = this.onPlayVideo.bind(this);
        this.onPauseVideo = this.onPauseVideo.bind(this);
        this.onRandomVideo = this.onRandomVideo.bind(this);
        this.onUpdateVideo = this.onUpdateVideo.bind(this);
    }

    onReady(event) {
        console.log(`YouTube Player object for videoId: "${this.state.videoId}" has been saved to state.`); // eslint-disable-line
        this.setState({
            player: event.target,
        });
    }

    onEnd(event) {
        this.onUpdateVideo();
    }

    onPlayVideo() {
        this.state.player.playVideo();
    }

    onPauseVideo() {
        this.state.player.pauseVideo();
    }

    onRandomVideo() {
        let randomData = setRandomId(this.props.data);

        new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            //use `.then()` to do something after `resolve()` has been called
            this.setState({
                videoId: randomData.id
            });
        }).then(() => {
            if (!this.showPlayer) {
                const logoContainer = document.getElementById("logo-container");

                const videoPlayer = document.getElementById("video-player");
                const videoIframe = videoPlayer.children[0].children[0];

                logoContainer.classList.add("fade-out");
                logoContainer.addEventListener("animationend", () => {
                    logoContainer.classList.add("hide");
                });

                videoIframe.classList.add("fade-in");
            }

            this.showPlayer = true;

            this.state.player.playVideo();
        }).catch(() => {
            //use `.catch()` to do something after `reject()` has been called
        }).finally(() => {
            //use `.finally()` to do something either way
        });
    }

    onUpdateVideo() {
        new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            setCategory(this.props.data);
        }).then(() => {
            this.onRandomVideo();
        }).then(() => {
            //setViews();
        }).catch(() => {

        }).finally(() => {

        });
    }

    render() {
        const opts = {
            width: "640",
            height: "480",
            playerVars: {
                rel: 0,
                autoplay: 1,
                controls: 0,
                iv_load_policy: 3,
                modestbranding: 1
            },
            frameBorder: "0"
        }

        return (
                <div id="player-container">
                <div id="logo-container">
                    <img id="deuspi-visual" onClick={this.onUpdateVideo} src={deuspiImage} alt="deuspi visual"/>
                </div>
                <div id="video-container" className="embed-responsive embed-responsive-16by9">
                    <div id="video-player" className="">
                        <YouTube videoId={this.state.videoId} className="random-video" ref={this.youtubePlayerRef} opts={opts} onReady={this.onReady} onEnd={this.onEnd}/>
                    </div>
                </div>
                <RandomButton onClick={this.onUpdateVideo} />
            </div>
        );
    }
}

export default VideoPlayer;