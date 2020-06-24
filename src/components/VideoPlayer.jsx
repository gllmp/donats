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
            categories: null,
            currentCategory: null
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
        this.getCategories = this.getCategories.bind(this);
        this.selectCategories = this.selectCategories.bind(this);
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

    onUpdateVideo = async () => {
        await new Promise((resolve, reject) => {
            resolve();
        }).then(async () => {
            await this.getCategories(this.props.categories);
        }).then(async () => {
            await this.selectCategories(this.props.slider);
        }).then(async () => {
            await this.setCategory(this.props.videos);
        }).then(async () => {
            await this.onRandomVideo();
        }).catch((error) => {
            console.error(error);
        }).finally(() => {

        });
    }

    getCategories(categories) {
        this.setState({
            categories: categories
        })
    }
    
    selectCategories(sliderRef) {
        let sliderCategory = sliderRef.current.state.category;
        console.log(sliderCategory)

        Object.keys(this.state.categories).forEach(element => {
            if (element === sliderCategory) {
                let selectedCategory = this.state.categories[element];
    
                this.setState({
                    currentCategory: selectedCategory
                })
    
                console.log("CURRENT CATEGORY: ", this.state.currentCategory);
            }
        });
    }
    
    setCategory(data) {
        let selectedData = [];
        
        this.state.currentCategory.forEach(element => {
            selectedData.push(element);
        })
    
        let index = Math.floor(Math.random() * Object.keys(selectedData).length);
        
        this.category = selectedData[index];
    }

    onRandomVideo() {
        let randomData = this.setRandomId(this.props.videos);

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
    
    setRandomId(data) {
        // set data category
        let dataCategory = data[this.category];
    
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
            category: this.category,
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