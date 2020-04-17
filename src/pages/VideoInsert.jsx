import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getYoutubeTitle from 'get-youtube-title';
import styled from 'styled-components';
import api from '../api';
//import FileUpload from '../components/FileUpload'

//import data from '../data.json'

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-insert',
})`
    
`

const Label = styled.label`
    
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    
`

const Select = styled.select.attrs({
    className: 'form-control',
})`
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

class VideoInsert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            url: '',
            category: '',
        }
    }

    handleChangeInputTitle = async event => {
        const title = event.target.value;
        this.setState({ title });
    }

    handleChangeInputUrl = async event => {
        const url = event.target.value;
        this.setState({ url });
    }
    
    handleChangeInputCategory = async event => {
        const category = event.target.value;
        this.setState({ category });
    }

    // handleIncludeDataFromFile = async () => {
    //      // /!\ REMEMBER TO ADD [] AT START AND END OF JSON FILE
    //     const _this = this;

    //     console.log("FILE: ", data);

    //     data.map( (data) => {        
    //         let skate = data.category.skate;
        
    //         skate.forEach(element => {
    //             console.log(element);

    //             _this.state.url = element.id;
    //             _this.state.category = "SKATE";

    //             const { title, url, category } = _this.state;

    //             let payload = { title, url, category };
                
    //             new Promise((resolve, reject) => {
    //                 console.log(_this.state)
    //                 getYoutubeTitle(_this.state.url, API_KEY, function (err, title) {
    //                     console.log("TITLE: ", title);
    //                     if (err) console.log("ERROR: ", err);
        
    //                     _this.setState({ title });
    //                     payload.title = title;
                        
    //                     resolve();
    //                 })    
    //             }).then(() => {
    //                 api.insertVideo(payload)
    //                 .then(res => {
    //                     console.log('Video inserted successfully');
    //                     this.setState({
    //                         title: '',
    //                         url: '',
    //                         category: '',
    //                     })
    //                 }).finally(() => {
    //                     //window.location.href = `/admin`;
    //                 });
        
    //             }).catch(() => {
            
    //             }).finally(() => {
            
    //             });    

                
    //         });
    //     })
    // }

    handleIncludeVideo = async () => {
        const _this = this;

        const { title, url, category } = this.state;
        
        if (!url) {
            alert("Please add URL");
        } else if (!category) {
            alert("Please add category");
        } else {
            let payload = { title, url, category };
        
            new Promise((resolve, reject) => {
                getYoutubeTitle(this.state.url, API_KEY, function (err, title) {
                    console.log("TITLE: ", title);
                    if (err) console.log("ERROR: ", err);
    
                    _this.setState({ title });
                    payload.title = title;
                    
                    resolve();
                })    
            }).then(() => {
                api.insertVideo(payload)
                .then(res => {
                    window.alert(`Video inserted successfully`);
                    this.setState({
                        title: '',
                        url: '',
                        category: '',
                    })
                }).finally(() => {
                    //window.location.href = `/admin`;
                });
    
            }).catch(() => {
        
            }).finally(() => {
        
            });    
        }        
    }

    render() {
        const { url, category } = this.state;
        return (
            <Wrapper className="col-sm-4 offset-md-4">
                {/* <FileUpload /> */}
                
                <Title className="mb-4">ADD VIDEO</Title>

                <Label>URL: </Label>
                <InputText
                    type="text"
                    value={url}
                    onChange={this.handleChangeInputUrl}
                />

                <Label className="mt-4">CATEGORY: </Label>

                <Select
                    type="text"
                    value={category}
                    onChange={this.handleChangeInputCategory}
                >
                    <option value="" hidden></option>
                    <option value="MUSIC">MUSIC</option>
                    <option value="RAP">RAP FR</option>
                    <option value="SKATE">SKATE</option>
                </Select>

                <div className="mt-4">
                    <Button onClick={this.handleIncludeVideo}>ADD VIDEO</Button>
                    <Link to="/admin/videos/list" className="btn btn-danger"> CANCEL </Link>
                </div>
            </Wrapper>
        )
    }
}

export default VideoInsert;
