import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
//import FileUpload from '../components/FileUpload'
import DragAndDrop from '../components/DragAndDrop'

//import data from '../data.json'

class CategoryInsert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            category: [],
            cover: '',
            url: ''
        }

        this.handleChangeInputName = this.handleChangeInputName.bind(this);
        this.handleChangeInputCategory = this.handleChangeInputCategory.bind(this);
        this.handleChangeInputCover = this.handleChangeInputCover.bind(this);
        this.handleChangeInputUrl = this.handleChangeInputUrl.bind(this);
    }

    handleChangeInputName = async event => {
        const name = event.target.value;
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
        const { name, category, cover, url } = this.state;
        
        if (!name) {
            alert("Please add name");
        } else {
            let payload = { name, category, cover, url };
        
            new Promise((resolve, reject) => {
                resolve();
            }).then(() => {
                // Add name to payload
                payload.name = name;
            }).then(() => {
                // Add categorie(s) to payload
                let categoryArray = [];
                categoryArray.push(name);

                //let categoryArrayDuplicate = [...this.state.category];
                //categoryArrayDuplicate.push(name);

                this.setState({ 
                    category: categoryArray
                });

                payload.category = category;
            }).then(() => {
                // Add cover to payload
                payload.category = category;
                payload.cover = cover;
                payload.url = url;
            }).then(() => {
                api.insertCategory(payload)
                .then(res => {
                    window.alert(`Video inserted successfully`);

                    this.setState({
                        name: '',
                        category: '',
                        cover: '',
                        url: ''
                    })
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
            <div id="category-insert-container">
                {/* <FileUpload /> */}
                
                <h1 id="category-insert-title">CATEGORY MANAGER</h1>

                <section id="category-insert-name" className="category-insert-section">
                    <label>NOM: </label>
                    <input id="category-name-input" className="form-control" type="text" value={name} onChange={this.handleChangeInputName} />
                </section>

                <section id="category-insert-cover" className="category-insert-section">
                    <DragAndDrop />
                </section>

                {/* <label className="mt-4">CATEGORY: </label>
                <select className="form-control" type="text" value={category} onChange={this.handleChangeInputCategory}>
                    <option value="" hidden></option>
                    <option value="MUSIC">MUSIC</option>
                    <option value="RAP">RAP FR</option>
                    <option value="SKATE">SKATE</option>
                </select>
                <ul>
                    {this.state.category.map(item => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>


                <label>COVER: </label>
                <input className="form-control" type="text" value={cover} onChange={this.handleChangeInputCover} />


                <label>URL: </label>
                <input className="form-control" type="text" value={url} onChange={this.handleChangeInputUrl} /> */}

                <div id="category-insert-button-container">
                    <button id="category-button-save" className="btn btn-primary" onClick={this.handleIncludeCategory}>SAVE</button>
                    <Link to="/admin/categories/list" id="category-button-cancel" className="btn btn-danger">CANCEL</Link>
                </div>
            </div>
        )
    }
}

export default CategoryInsert;
