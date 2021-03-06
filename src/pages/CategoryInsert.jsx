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
            order: '',
            savedCategories: [],
            isVisible: true,
            isCentered: false,
            isLoading: true,
            isUploading: false
        }

        this.handleChangeInputName = this.handleChangeInputName.bind(this);
        this.handleChangeInputUrl = this.handleChangeInputUrl.bind(this);
        this.handleChangeInputOrder = this.handleChangeInputOrder.bind(this);
        this.handleChangeInputIsVisible = this.handleChangeInputIsVisible.bind(this);
        this.handleChangeInputIsCentered = this.handleChangeInputIsCentered.bind(this);
        this.reorderCategories = this.reorderCategories.bind(this);
        this.uploadFileToCloudinary = this.uploadFileToCloudinary.bind(this);
        this.uploadCategory = this.uploadCategory.bind(this);
    }

    componentDidMount = async () => {
        this.dragAndDropRef = React.createRef();
        this.categoryToggleRef = React.createRef();
        
        await api.getAllCategories().then(categories => {
            let reorderedCategories = [];
            reorderedCategories = this.reorderCategories(categories.data.data);
            
            this.setState({
                savedCategories: reorderedCategories,
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
    
    handleChangeInputOrder(event) {
        const order = event.target.value;
        
        this.setState({ order });
    }

    handleChangeInputIsVisible() {
        const isVisible = !this.state.isVisible;

        this.setState({ isVisible });
    }   

    handleChangeInputIsCentered() {
        const isCentered = !this.state.isCentered;

        this.setState({ isCentered });
    }

    reorderCategories(categoriesData) {
        let categoriesOrders = [];
        categoriesData.forEach(category => {
            categoriesOrders.push(category.order);
        });
        
        let reorderedCategories = [];
        categoriesData.forEach(category => {
            reorderedCategories[category.order - 1] = category;
        });
        //console.log("REORDERED CATEGORIES: ", reorderedCategories);

        return reorderedCategories;
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
                    alert("L'upload du ficher vers Cloudinary a ??chou??");
                } else if (response.status === 200) {
                    // upload success
                    resolve(response);
                } else {
                    //reject();
                }
            });        
        }).then((result) => {
            this.setState({
                cover: result.body.secure_url
            })

            //console.log("UPLOADED FILE: ", this.state);
            console.log("Fichi?? upload?? avec succ??s sur Cloudinary !");

            return this.state.cover;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
    
        });    
    }

    uploadCategory() {        
        const { name, category, cover, isVisible, isCentered, url, order, savedCategories } = this.state;

        if (!name) {
            alert("Ajoutez un nom avant de continuer");
        } else if (!this.dragAndDropRef.current.state.hasLoaded) {
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

            const promiseIsCentered = new Promise((resolve, reject) => {
                resolve(this.state.isCentered);
            });

            const promiseCover = new Promise(async (resolve, reject) => {
                    await this.uploadFileToCloudinary(this.dragAndDropRef.current.state.file);

                    resolve(this.state.cover);
            })

            const promiseUrl = new Promise((resolve, reject) => {
                resolve(this.state.url);
            });

            const promiseOrder = new Promise(async (resolve, reject) => {
                let totalCategories = this.state.savedCategories.length;

                await this.setState({ 
                    order: totalCategories + 1
                });

                resolve(this.state.order);            
            });

            let payload = { name, category, cover, isVisible, isCentered, url, order };

            Promise.all([promiseName, promiseCategory, promiseIsVisible, promiseIsCentered, promiseCover, promiseUrl, promiseOrder])
            .then((values) => {
                //console.log(values);

                payload.name = values[0];
                payload.category = values[1];
                payload.isVisible = values[2];
                payload.isCentered = values[3];
                payload.cover = values[4];
                payload.url = values[5];
                payload.order = values[6];

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
                        isVisible: true,
                        isCentered: false,
                        url: '',
                        order: '',
                        isUploading: false
                    });

                    window.alert(`Cat??gorie cr????e avec succ??s`);
                }).catch((error) => {
                    this.setState({
                        isUploading: false
                    });

                    console.error(error);
                    window.alert(`La cr??ation de la cat??gorie a ??chou??e`);
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
        const { name, url, order } = this.state;

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

                                    <section id="category-insert-categories" className="category-insert-section">
                                        <p id="category-toggle-title">{this.state.savedCategories.length} CAT??GORIES DISPONIBLES</p>
                                        <CategoryToggle categories={this.state.savedCategories} ref={this.categoryToggleRef} />
                                    </section>

                                    <section id="category-insert-url-visible" className="category-insert-section">
                                        {/* <input id="category-url-input" className="form-control" type="text" value={url} placeholder="URL" onChange={this.handleChangeInputUrl} /> */}
                                        {/* <input id="category-order-input" className="form-control" type="text" value={order} placeholder="ORDER" onChange={this.handleChangeInputOrder} /> */}

                                        {/* <form>
                                            <input list="data"  />
                                            <datalist id="data">
                                                {this.state.savedCategories.map((item, key) =>
                                                    <option key={key} value={item.order} />
                                                )}
                                            </datalist>
                                        </form> */}

                                        <div id="category-visible-container">
                                            <Checkbox className="category-visible-checkbox" checked={this.state.isVisible} disableRipple={true} onChange={this.handleChangeInputIsVisible} />
                                            <label id="category-visible-label">VISIBLE</label>
                                        </div>
                                        {/* <div id="category-centered-container">
                                            <Checkbox className="category-centered-checkbox" checked={this.state.isCentered} disableRipple={true} onChange={this.handleChangeInputIsCentered} />
                                            <label id="category-centered-label">CENTERED</label>
                                        </div> */}
                                    </section>

                                    <section id="category-insert-button-container" className="category-insert-section">
                                        <button id="category-button-save" className="btn btn-primary" onClick={this.uploadCategory}>SAVE</button>
                                        <Link to="/admin/categories/list" id="category-button-cancel" className="btn btn-warning">CANCEL</Link>
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
