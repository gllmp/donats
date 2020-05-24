import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
            cover: '',
            url: '',
            categories: [],
            isLoading: false
        }

        this.handleChangeInputName = this.handleChangeInputName.bind(this);
        this.handleChangeInputCategory = this.handleChangeInputCategory.bind(this);
        this.handleChangeInputCover = this.handleChangeInputCover.bind(this);
        this.handleChangeInputUrl = this.handleChangeInputUrl.bind(this);
    }

    componentDidMount = async () => {
        this.dragAndDropRef = React.createRef();

        this.setState({ isLoading: true });
        
        await api.getAllCategories().then(categories => {
            this.setState({
                categories: categories.data.data,
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

    handleChangeInputCategory = async event => {
        const category = event.target.value;
        this.setState({ category });
    }

    handleChangeInputCover = async event => {
        const cover = event.target.value;
        this.setState({ cover });
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

    handleIncludeCategory = async () => {
        const { name, category, cover, url, categories, isLoading } = this.state;
        
        if (!name) {
            alert("Please add name");
        } else if (!this.dragAndDropRef.current.state.src.length) {
            alert("Please add cover image");
        } else {
            let payload = { name, category, cover, url };
        
            new Promise((resolve, reject) => {
                resolve();
            }).then(() => {
                // Add name to payload
                payload.name = this.state.name;
            }).then(() => {
                // Add categorie(s) to payload
                let categoryArray = [];
                categoryArray.push(name);

                //let categoryArrayDuplicate = [...this.state.category];
                //categoryArrayDuplicate.push(name);

                this.setState({ 
                    category: categoryArray
                });

                payload.category = this.state.category;
            }).then(() => {
                // Add cover to payload
                this.setState({ 
                    cover: this.dragAndDropRef.current.state.src 
                });

                payload.cover = this.state.cover;
            }).then(() => {
                // Add url to payload

                payload.url = this.state.url;
            }).then(() => {
                console.log("CATEGORY STATE: ", this.state);
            }).then(() => {
                // api.insertCategory(payload)
                // .then(res => {
                //     window.alert(`Category inserted successfully`);

                //     this.setState({
                //         name: '',
                //         category: '',
                //         cover: '',
                //         url: ''
                //     })
                // }).catch((error) => {
                //     window.alert(`Category upload failed`);
                //     console.error(error);
                // });
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
                        {/* <FileUpload /> */}
                        
                        <h1 id="category-insert-title">CATEGORY MANAGER</h1>

                        <section id="category-insert-name" className="category-insert-section">
                            {/* <label>NOM: </label> */}
                            <input id="category-name-input" className="form-control" type="text" value={name} placeholder="NOM" onChange={this.handleChangeInputName} />
                        </section>

                        <section id="category-insert-cover" className="category-insert-section">
                            <DragAndDrop ref={this.dragAndDropRef} />
                        </section>

                        <section id="category-insert-url" className="category-insert-section">
                            <input id="category-url-input" className="form-control" type="text" value={url} placeholder="URL" onChange={this.handleChangeInputUrl} />
                        </section>

                        <section id="category-insert-categories" className="category-insert-section">
                            <p id="category-toggle-title">{this.state.categories.length} CATÉGORIES DISPONIBLES</p>
                            <CategoryToggle categories={this.state.categories} />
                        </section>

                        <section id="category-insert-button-container" className="category-insert-section">
                            <button id="category-button-save" className="btn btn-primary" onClick={this.handleIncludeCategory}>SAVE</button>
                            <Link to="/admin/categories/list" id="category-button-cancel" className="btn btn-danger">CANCEL</Link>
                        </section>
                        </div>
                    )}
            </div>
        )
    }
}

export default CategoryInsert;
