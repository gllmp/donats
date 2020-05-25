import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CloudinaryContext } from "cloudinary-react";
import request from 'superagent';
import api from '../api';
//import FileUpload from '../components/FileUpload'
import DragAndDrop from '../components/DragAndDrop'
import CategoryToggle from '../components/CategoryToggle'

//import data from '../data.json'

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
            isLoading: false
        }

        this.handleChangeInputName = this.handleChangeInputName.bind(this);
        this.handleChangeInputUrl = this.handleChangeInputUrl.bind(this);
        this.uploadFileToCloudinary = this.uploadFileToCloudinary.bind(this);
        this.uploadCategory = this.uploadCategory.bind(this);
    }

    componentDidMount = async () => {
        this.dragAndDropRef = React.createRef();

        this.setState({ isLoading: true });
        
        await api.getAllCategories().then(categories => {
            this.setState({
                savedCategories: categories.data.data,
                isLoading: false,
            });
        })
    }

    componentWillUnmount() {

    }
    
    handleChangeInputName = async event => {
        const name = event.target.value.toUpperCase();
        this.setState({ name });
    }

    handleChangeInputUrl = async event => {
        const url = event.target.value;
        this.setState({ url });
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
        
    //             }).catch((error) => {
    //                  console.error(error);
    //             }).finally(() => {
            
    //             });    

                
    //         });
    //     })
    // }

    uploadFileToCloudinary = async (file, payload) => {
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
                    console.log("File upload to Cloudinary has failed ", error);
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
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
    
        });    
    }

    uploadCategory = async () => {
        const { name, category, cover, url, savedCategories } = this.state;

        if (!name) {
            alert("Please add name");
        } else if (this.state.isVisible && !this.dragAndDropRef.current.state.hasLoaded) {
            alert("Please add cover image");
        } else {        
            let payload = { name, category, cover, url };

            await new Promise((resolve, reject) => {
            
                resolve(payload);
            }).then((result) => {
                // Add name to payload
                result.name = this.state.name;

                return result;
            }).then((result) => {
                // Add categorie(s) to payload
                let categoryArray = [];
                categoryArray.push(name);

                //let categoryArrayDuplicate = [...this.state.category];
                //categoryArrayDuplicate.push(name);

                this.setState({ 
                    category: categoryArray
                });

                result.category = this.state.category;

                return result;
            }).then(async (result) => {
                // Upload cover only if category is visible
                if (this.state.isVisible) {                
                    await this.uploadFileToCloudinary(this.dragAndDropRef.current.state.file, result);

                    return result;
                } else {

                    return await result;
                }
            }).then((result) => {
                // Add cover to payload
                result.cover = this.state.cover;

                return result;
            }).then((result) => {
                // Add url to payload
                result.url = this.state.url;    

                return result;
            }).then((result) => {
                payload.name = result.name;
                payload.category = result.category;
                payload.cover = result.cover;
                payload.url = result.url;

                console.log("PAYLOAD: ", payload);
                console.log("CATEGORY STATE: ", this.state);

                return payload;
            }).then((result) => {
                api.insertCategory(result)
                .then(res => {
                    window.alert(`Catégorie créée avec succès`);

                    this.setState({
                        name: '',
                        category: '',
                        cover: '',
                        url: ''
                    })
                }).catch((error) => {
                    window.alert(`La création de la catégorie a échouée`);
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
        
            });
        }        
    }

    render() {
        const { name, category, cover, url } = this.state;

        return (
            <div id="category-insert-wrapper">
                {!this.state.isLoading && (
                    <div id="category-insert-container">
                        <div className="row">
                            <div className="col-lg">
                                <div className="align-items-center justify-content-center">
                                    {/* <FileUpload /> */}
                                    
                                    <h1 id="category-insert-title">CATEGORY MANAGER</h1>

                                    <section id="category-insert-name" className="category-insert-section">
                                        {/* <label>NOM: </label> */}
                                        <input id="category-name-input" className="form-control" type="text" value={name} placeholder="NOM" onChange={this.handleChangeInputName} />
                                    </section>

                                    <section id="category-insert-cover" className="category-insert-section">
                                        <CloudinaryContext cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}>
                                            <DragAndDrop ref={this.dragAndDropRef} />
                                        </CloudinaryContext>
                                    </section>

                                    <section id="category-insert-url" className="category-insert-section">
                                        <input id="category-url-input" className="form-control" type="text" value={url} placeholder="URL" onChange={this.handleChangeInputUrl} />
                                    </section>

                                    <section id="category-insert-categories" className="category-insert-section">
                                        <p id="category-toggle-title">{this.state.savedCategories.length} CATÉGORIES DISPONIBLES</p>
                                        <CategoryToggle categories={this.state.savedCategories} />
                                    </section>

                                    <section id="category-insert-button-container" className="category-insert-section">
                                        <button id="category-button-save" className="btn btn-primary" onClick={this.uploadCategory}>SAVE</button>
                                        <Link to="/admin/categories/list" id="category-button-cancel" className="btn btn-danger">CANCEL</Link>
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
