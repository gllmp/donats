import React from 'react';
import YouTube from 'react-youtube';

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.youtubePlayerRef = React.createRef();

        this.state = {
            videoId: "",
            player: null,
            showPlayer: false,
            playlists: null,
            currentPlaylist: null
        };

        this.category = "";

        this.onReady = this.onReady.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onShowPlayer = this.onShowPlayer.bind(this);
        this.onClosePlayer = this.onClosePlayer.bind(this);
        this.onPlayVideo = this.onPlayVideo.bind(this);
        this.onPauseVideo = this.onPauseVideo.bind(this);
        this.onUpdateVideo = this.onUpdateVideo.bind(this);
        this.onRandomVideo = this.onRandomVideo.bind(this);
        this.getPlaylist = this.getPlaylist.bind(this);
        this.setPlaylist = this.setPlaylist.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setRandomId = this.setRandomId.bind(this);
        this.shuffleId = this.shuffleId.bind(this);
    }

    componentDidMount() {

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

    onShowPlayer() {
        this.setState({
            showPlayer: true
        });
    }

    onClosePlayer() {
        this.setState({
            showPlayer: false
        });
    }

    onPlayVideo() {
        this.state.player.playVideo();
    }

    onPauseVideo() {
        this.state.player.pauseVideo();
    }

    onUpdateVideo() {
        new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            this.getPlaylist(this.props.playlist);
        }).then(() => {
            this.setPlaylist(this.props.slider);
        }).then(() => {
            this.setCategory(this.props.data);
        }).then(() => {
            this.onRandomVideo();
        }).catch((error) => {
            console.error(error);
        }).finally(() => {

        });
    }

    onRandomVideo() {
        let randomData = this.setRandomId(this.props.data);

        new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            //use `.then()` to do something after `resolve()` has been called
            this.setState({
                videoId: randomData.id
            });
        }).then(() => {
            this.state.player.playVideo();
        }).catch((error) => {
            //use `.catch()` to do something after `reject()` has been called
            console.error(error);
        }).finally(() => {
            //use `.finally()` to do something either way
        });
    }

    getPlaylist(playlists) {
        this.setState({
            playlists: playlists
        })
    }
    
    setPlaylist(sliderRef) {
        let sliderPlaylist = sliderRef.current.state.playlist;

        Object.keys(this.state.playlists).forEach(element => {
            if (element === sliderPlaylist) {
                let selectedPlaylist = this.state.playlists[element];
    
                this.setState({
                    currentPlaylist: selectedPlaylist
                })
    
                console.log("PLAYLIST: ", this.state.currentPlaylist);
            }
        });    
    }
    
    setCategory(data) {
        let selectedData = [];
    
        this.state.currentPlaylist.forEach(element => {
            selectedData.push(element);
        })
    
        let index = Math.floor(Math.random() * Object.keys(selectedData).length);
        
        category = selectedData[index];
    }
    
    setRandomId(data) {
        // set data category
        let dataCategory = data[category];
    
        // set video index
        let videoIndex;
        const videoLength = dataCategory.length;
    
        videoIndex = Math.floor(Math.random() * videoLength);
    
        // shuffle category array
        let randomArray = dataCategory;
    
        this.shuffleId(randomArray)
    
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
        console.log("VIDEO: ", videoData);
    
        return videoData;
    }
    
    shuffleId(array) {
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
                    <div id="video-container" className="embed-responsive embed-responsive-16by9">
                        <div id="video-player" className="">
                            <YouTube videoId={this.state.videoId} className="random-video" ref={this.youtubePlayerRef} opts={opts} onReady={this.onReady} onEnd={this.onEnd} />
                        </div>
                    </div>
                </div>
        );
    }
}

export default VideoPlayer;