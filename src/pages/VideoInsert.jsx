import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getYoutubeTitle from 'get-youtube-title';
import styled from 'styled-components';
import api from '../api';
import DragAndDropVideoFile from '../components/DragAndDropVideoFile'
// import FileUpload from '../components/FileUpload'

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
            savedCategories: [],
            categoriesSelectItems: [],
            isLoading: true
        }
    }

    componentDidMount = async () => {
        this.dragAndDropRef = React.createRef();

        await api.getAllCategories().then(categories => {
            this.setState({
                savedCategories: categories.data.data,
            });
        })

        new Promise((resolve, reject) => {
            resolve(this.state.savedCategories);
        }).then((result) => {
            const optionsList = result.map((category) =>
                <option value={category.name} key={category.name.toString()}>{category.name}</option>
            );


            this.setState({
                categoriesSelectItems: optionsList,
                isLoading: false
            })
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
    
        }); 
    }

    componentWillUnmount() {

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

    handleIncludeDataFromFile = async () => {
         // /!\ REMEMBER TO ADD [] AT START AND END OF JSON FILE
        const _this = this;
        
        const data = this.dragAndDropRef.current.state.data;
        console.log("FILE DATA: ", data[0]);

        let currentCategory;
        let currentCategoryIndex = 0;

        if (data.length > 0) {
            data.map( (data) => {      
                Object.keys(data.category).forEach(category => {
                    currentCategory = category;

                    data.category[category].forEach(element => {
                        _this.state.url = element.id;
                        _this.state.category = currentCategory.toUpperCase();

                        const { title, url, category } = _this.state;

                        let payload = { title, url, category };
                        
                        new Promise((resolve, reject) => {
                            //console.log(_this.state)
                            getYoutubeTitle(_this.state.url, API_KEY, function (err, title) {
                                console.log("TITLE: ", title);
                                if (err) console.log("ERROR: ", err);
                
                                _this.setState({ title });
                                payload.title = title;
                                
                                resolve();
                            })    
                        }).then(() => {
                            api.insertVideo(payload)
                            .then(res => {
                                this.setState({
                                    title: '',
                                    url: '',
                                    category: '',
                                })
                            }).finally(() => {
                                //window.location.href = `/admin`;
                            });
                
                        }).catch((error) => {
                            console.error(error);
                        }).finally(() => {
                            currentCategoryIndex++;
                            if (currentCategoryIndex === data.category[currentCategory].length) {
                                window.alert(`Vidéo ajoutée avec succès`);
                            }
                        });
                    });
                });
            })
        } else {
            alert("Veuillez ajouter un fichier ou remplir les champs avant de continuer");
        }

    }

    handleIncludeVideo = async () => {
        const _this = this;
        
        const data = this.dragAndDropRef.current.state.data;    

        const { title, url, category } = this.state;

        if (!url && data.length === 0) {
            alert("Ajoutez une URL avant de continer");
        } else if (!category && data.length === 0) {
            alert("Ajoutez une catégorie avant de continuer");
        } else if (data.length > 0) {
            // Upload data from file
            this.handleIncludeDataFromFile();
        } else {
            // Upload data from form
            let payload = { title, url, category };
        
            await new Promise((resolve, reject) => {
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
                    this.setState({
                        title: '',
                        url: '',
                        category: '',
                    })
                }).finally(() => {
                    //window.location.href = `/admin`;
                });    
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                window.alert(`Vidéo ajoutée avec succès`);
            });
        }        
    }

    render() {
        const { url, category } = this.state;
        return (
            <div id="video-insert-container">
                {!this.state.isLoading && (
                    <Wrapper className="col-sm-4 offset-md-4">                        
                        <Title className="mb-4">ADD VIDEO</Title>

                        <DragAndDropVideoFile ref={this.dragAndDropRef} />
                        {/* <FileUpload /> */}

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
                            {/* <option value="MUSIC">MUSIC</option>
                            <option value="RAP">RAP FR</option>
                            <option value="SKATE">SKATE</option> */}
                            {this.state.categoriesSelectItems}
                        </Select>

                        <div className="mt-4">
                            <Button onClick={this.handleIncludeVideo}>ADD VIDEO</Button>
                            <Link to="/admin/videos/list" className="btn btn-danger"> CANCEL </Link>
                        </div>
                    </Wrapper>
                )}
            </div>
        )
    }
}

export default VideoInsert;
