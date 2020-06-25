import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CloudinaryContext } from "cloudinary-react";
import request from 'superagent';
import api from '../api';
import { history } from '../utils';
import Checkbox from '@material-ui/core/Checkbox';
import DragAndDropCover from '../components/DragAndDropCover'
import CategoryToggle from '../components/CategoryToggle'
import loadingCircle from '../assets/img/loading-circle.gif'

class CategoryInsert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            category: [],
            cover: 'https://res.cloudinary.com/donats/image/upload/v1590425039/category-cover_ulikx1.png',
            url: '',
            savedCategories: [],
            isVisible: true,
            isLoading: true,
            isUploading: false
        }

        this.handleChangeInputName = this.handleChangeInputName.bind(this);
        this.handleChangeInputUrl = this.handleChangeInputUrl.bind(this);
        this.handleChangeInputIsVisible = this.handleChangeInputIsVisible.bind(this);
        this.uploadFileToCloudinary = this.uploadFileToCloudinary.bind(this);
        this.uploadCategory = this.uploadCategory.bind(this);
    }

    componentDidMount = async () => {
        this.dragAndDropRef = React.createRef();
        this.categoryToggleRef = React.createRef();
        
        await api.getAllCategories().then(categories => {
            this.setState({
                savedCategories: categories.data.data,
                isLoading: false,
            });
        })

        console.log("CATEGORY INSERT STATE: ", this.state);
    }

    componentWillUnmount() {

    }
    
    handleChangeInputName(event) {
        const name = event.target.value.toUpperCase();

        this.state.savedCategories.forEach(element => {
            if (name === element.name) {
                window.alert("Ce nom n'est pas disponible");
            }
        });

        this.setState({ name });
    } 

    handleChangeInputUrl(event) {
        const url = event.target.value;
        
        this.setState({ url });
    }
    
    handleChangeInputIsVisible() {
        const isVisible = !this.state.isVisible;

        this.setState({ isVisible });
    }   

    uploadFileToCloudinary = async (file) => {
        // upload compressed file to Cloudinary with unsigned preset
        const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUDNAME}/upload`;

        await new Promise((resolve, reject) => {
            request
            .post(url)
            .field("file", file)
            .field("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET)
            .field("context", this.state.name ? `photo=${this.state.name}` : '')
            .field("tags", this.state.name ? `myphotoalbum,${this.state.name}` : 'myphotoalbum')
            .field("multiple", true)
            .end((error, response) => {
                //console.log("CLOUDINARY RESPONSE: ", response);
                if (error != null) {
                    // upload failed
                    //console.log("File upload to Cloudinary has failed ", error);
                    alert("L'upload du ficher vers Cloudinary a échoué");
                } else if (response.status === 200) {
                    // upload success
                    resolve(response);
                } else {
                    //reject();
                }
            });        
        }).then((result) => {
            this.setState({
                cover: result.body.url
            })

            //console.log("UPLOADED FILE: ", this.state);
            console.log("File upload to Cloudinary successful");

            return this.state.cover;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
    
        });    
    }

    uploadCategory() {        
        const { name, category, cover, isVisible, url, savedCategories } = this.state;

        if (!name) {
            alert("Ajoutez un nom avant de continuer");
        } else if (this.state.isVisible && !this.dragAndDropRef.current.state.hasLoaded) {
            alert("Ajoutez une image avant de continuer");
        } else {
            this.setState({
                isUploading: true
            });
            
            const promiseName = new Promise((resolve, reject) => {

                resolve(this.state.name);
            });

            const promiseCategory = new Promise(async (resolve, reject) => {
                let categoryArray = [];
                categoryArray.push(this.state.name);

                savedCategories.forEach(element => {
                    if (this.categoryToggleRef.current.state.togglesChecked[element.name] === true) {
                        categoryArray.push(element.name)
                    }
                });
            
                await this.setState({ 
                    category: categoryArray
                });

                resolve(this.state.category);
            });

            const promiseIsVisible = new Promise((resolve, reject) => {
                resolve(this.state.isVisible);
            });

            const promiseCover = new Promise(async (resolve, reject) => {
                // Upload cover only if category is visible
                if (this.state.isVisible) {                
                    await this.uploadFileToCloudinary(this.dragAndDropRef.current.state.file);

                    resolve(this.state.cover);
                } else {
                    resolve(this.state.cover);
                }
            })

            const promiseUrl = new Promise((resolve, reject) => {
                resolve(this.state.url);
            });

            let payload = { name, category, cover, isVisible, url };

            Promise.all([promiseName, promiseCategory, promiseIsVisible, promiseCover, promiseUrl])
            .then((values) => {
                //console.log(values);

                payload.name = values[0];
                payload.category = values[1];
                payload.isVisible = values[2];
                payload.cover = values[3];
                payload.url = values[4];

                console.log("PAYLOAD: ", payload);
                console.log("CATEGORY STATE: ", this.state);

                return payload;
            }).then(async (result) => {
                await api.insertCategory(result)
                .then(res => {
                    this.setState({
                        name: '',
                        category: '',
                        cover: '',
                        //isVisible: true,
                        url: '',
                        isUploading: false
                    });

                    window.alert(`Catégorie créée avec succès`);
                }).catch((error) => {
                    this.setState({
                        isUploading: false
                    });

                    console.error(error);
                    window.alert(`La création de la catégorie a échouée`);
                });
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                history.push(process.env.PUBLIC_URL + "/admin/categories/list");
                window.location.reload(true);
            });
        }

    }

    render() {
        const { name, url } = this.state;

        return (
            <div id="category-insert-wrapper">
                {!this.state.isLoading && (
                    <div id="category-insert-container">
                        <div className="row">
                            <div className="col-lg">
                                <div className="align-items-center justify-content-center">                                    
                                    <h1 id="category-insert-title">CATEGORY MANAGER</h1>

                                    <section id="category-insert-name" className="category-insert-section">
                                        <input id="category-name-input" className="form-control" type="text" value={name} placeholder="NOM" onChange={this.handleChangeInputName} />
                                    </section>

                                    <section id="category-insert-cover" className="category-insert-section">
                                        <CloudinaryContext cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}>
                                            <DragAndDropCover ref={this.dragAndDropRef} />
                                        </CloudinaryContext>
                                    </section>

                                    <section id="category-insert-url-visible" className="category-insert-section">
                                        <input id="category-url-input" className="form-control" type="text" value={url} placeholder="URL" onChange={this.handleChangeInputUrl} />
                                        <div id="category-visible-container">
                                            <Checkbox className="category-visible-checkbox" checked={this.state.isVisible} disableRipple={true} onChange={this.handleChangeInputIsVisible} />
                                            <label id="category-visible-label">VISIBLE</label>
                                        </div>
                                    </section>

                                    <section id="category-insert-categories" className="category-insert-section">
                                        <p id="category-toggle-title">{this.state.savedCategories.length} CATÉGORIES DISPONIBLES</p>
                                        <CategoryToggle categories={this.state.savedCategories} ref={this.categoryToggleRef} />
                                    </section>

                                    <section id="category-insert-button-container" className="category-insert-section">
                                        <button id="category-button-save" className="btn btn-primary" onClick={this.uploadCategory}>SAVE</button>
                                        <Link to="/admin/categories/list" id="category-button-cancel" className="btn btn-danger">CANCEL</Link>
                                        {this.state.isUploading &&
                                            <img className="loading-circle" alt="gif" src={loadingCircle} />
                                        }
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default CategoryInsert;
