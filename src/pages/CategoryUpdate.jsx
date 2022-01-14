import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CloudinaryContext } from "cloudinary-react";
import request from 'superagent';
import api from '../api';
import { history } from '../utils';
import Checkbox from '@material-ui/core/Checkbox';
import DragAndDropCover from '../components/DragAndDropCover'
import CategoryUpdateToggle from '../components/CategoryUpdateToggle'
import loadingCircle from '../assets/img/loading-circle.gif'

class CategoryUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            name: '',
            category: [],
            cover: '',
            toggleList: {},
            savedCategories: [],
            initialCategoryParameters: {},
            url: '',
            order: '',
            isVisible: true,
            isCentered: false,
            isLoading: true,
            isUploading: false
        }

        this.getInitialCategoryParameters = this.getInitialCategoryParameters.bind(this);
        this.initiateToggleList = this.initiateToggleList.bind(this);
        this.handleChangeInputName = this.handleChangeInputName.bind(this);
        this.handleChangeCategorySwitch = this.handleChangeCategorySwitch.bind(this);
        this.handleChangeInputUrl = this.handleChangeInputUrl.bind(this);
        this.handleChangeInputIsVisible = this.handleChangeInputIsVisible.bind(this);
        this.handleChangeInputOrder = this.handleChangeInputOrder.bind(this);
        this.handleChangeInputIsCentered = this.handleChangeInputIsCentered.bind(this);
        this.listHasChanged = this.listHasChanged.bind(this);
        this.checkUpdatedParameters = this.checkUpdatedParameters.bind(this);
        this.uploadFileToCloudinary = this.uploadFileToCloudinary.bind(this);
        this.uploadCategory = this.uploadCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    componentDidMount = async () => {
        const { id } = this.state;
        const category = await api.getCategoryById(id)

        this.setState({
            name: category.data.data.name,
            category: category.data.data.category,
            cover: category.data.data.cover,
            url: category.data.data.url,
            order: category.data.data.order,
            isVisible: category.data.data.isVisible,
            isCentered: category.data.data.isCentered
        })

        this.dragAndDropRef = React.createRef();
        this.categoryToggleRef = React.createRef();
        
        await api.getAllCategories().then(categories => {            
            this.setState({
                savedCategories: categories.data.data,
                isLoading: false,
            });
        })

        await this.initiateToggleList().then(list => {
            this.setState({
                toggleList: list
            });
        })
        
        console.log("CATEGORY TOGGLE LIST: ", this.state.toggleList);

        this.getInitialCategoryParameters();

        console.log("CATEGORY UPDATE STATE: ", this.state);
    }

    componentWillUnmount() {

    }

    getInitialCategoryParameters() {
        const cloneToggleList = { ...this.state.toggleList };

        this.setState({
            initialCategoryParameters: {
                _id: this.state.id,
                name: this.state.name,
                category: this.state.category,
                toggleList: cloneToggleList,
                isVisible: this.state.isVisible,
                isCentered: this.state.isCentered,
                cover: this.state.cover,
                url: this.state.url,
                order: this.state.order,
            }
        })
    }

    initiateToggleList = async () => {
        let togglesCheckedArray = {};
    
        new Promise((resolve, reject) => {
          resolve(togglesCheckedArray);
        }).then(() => {
          if (this.state.category !== undefined) {
            // for category update, activate all selected categories
            this.state.savedCategories.forEach(category => {
              togglesCheckedArray[category.name] = false;
      
              this.state.category.forEach(selectedCategory => {
                if (category.name === selectedCategory) {
                  togglesCheckedArray[category.name] = true;
                }
              })
            });

            return togglesCheckedArray;
          } else {
            // set category toggles unchecked by default
            this.state.savedCategories.forEach(category => {
              togglesCheckedArray[category.name] = false;
            });

            return togglesCheckedArray;
          }
        }).then((togglesCheckedArray) => {
          // this.setState({
          //   togglesChecked: togglesCheckedArray
          // });
    
            return togglesCheckedArray;
        }).catch((error) => {
            console.error(error);
        })

        return togglesCheckedArray;
    }

    handleChangeInputName(event) {
        const name = event.target.value.toUpperCase();
       
        let toggleLabels = document.getElementsByClassName("MuiFormControlLabel-label");
        for (let i = 0; i<toggleLabels.length; i++) {
            if (toggleLabels[i].textContent === this.state.name) {
                toggleLabels[i].textContent = name;            
            }
        }

        this.state.savedCategories.forEach(element => {
            if (name === element.name) {
                window.alert("Ce nom n'est pas disponible");
            }
        });

        this.setState({ name });
    }

    handleChangeCategorySwitch(list) {
        const toggleList = list;

        this.setState({ toggleList })        
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

    listHasChanged(initialList, updatedList) {
        initialList = Object.entries(initialList);
        updatedList = Object.entries(updatedList);

        if (this.state.name !== this.state.initialCategoryParameters.name) return true;

        if (initialList.length !== updatedList.length) return true;
        
        for (let i = 0; i < initialList.length; i++){
            if (initialList[i][1] !== updatedList[i][1]){
                return true;
            }
        }

        return false; 
    }

    checkUpdatedParameters() {
        const { _id, name, category, toggleList, cover, isVisible, isCentered, url, order, savedCategories } = this.state;

        // check if each category parameters have been changed
        let updatedCategoryParameters = {
            isNameUpdated: false,
            isCoverUpdated: false,
            isCategoryUpdated: false,
            isUrlUpdated: false,
            isOrderUpdated: false,
            isVisibleUpdated: false,
            isCenteredUpdated: false
        }

        // NAME
        if (name !== this.state.initialCategoryParameters.name) {
            if (!name) {
                alert("Ajoutez un nom avant de continuer");
            } else {
                updatedCategoryParameters.isNameUpdated = true;
            }
        }

        // COVER
        if (this.dragAndDropRef.current.state.size) {
            if (!this.dragAndDropRef.current.state.hasLoaded) {
                alert("Ajoutez une image avant de continuer");
            } else {
                updatedCategoryParameters.isCoverUpdated = true;
            }
        }

        // CATEGORY
        if (this.listHasChanged(toggleList, this.state.initialCategoryParameters.toggleList)) {
            if (Object.values(toggleList).every((toggleValue) => {
                    return toggleValue === false;
                })) 
            {
                alert("Ajoutez une catégorie avant de continuer");
            } else {
                updatedCategoryParameters.isCategoryUpdated = true;
            }
        }
        
        // VISIBLE
        if (isVisible !== this.state.initialCategoryParameters.isVisible) {
            updatedCategoryParameters.isVisibleUpdated = true;
        }

        // CENTERED
        if (isCentered !== this.state.initialCategoryParameters.isCentered) {
            updatedCategoryParameters.isCenteredUpdated = true;
        }

        // URL
        if (url !== this.state.initialCategoryParameters.url) {
            updatedCategoryParameters.isUrlUpdated = true;
        }

        // ORDER
        if (order !== this.state.initialCategoryParameters.order) {
            updatedCategoryParameters.isOrderUpdated = true;
        }

        console.log("CATEGORY UPDATED PARAMETERS: ", updatedCategoryParameters);

        return updatedCategoryParameters;
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
                cover: result.body.secure_url
            })

            //console.log("UPLOADED FILE: ", this.state);
            console.log("Fichié uploadé avec succès sur Cloudinary !");

            return this.state.cover;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
    
        });    
    }

    uploadCategory() {        
        const { _id, name, category, toggleList, cover, isVisible, isCentered, url, order, savedCategories } = this.state;
        
        let updatedCategoryParameters = this.checkUpdatedParameters();

        this.setState({
            isUploading: true
        });
        
        const promiseName = new Promise((resolve, reject) => {
            if (updatedCategoryParameters.isNameUpdated) {
                resolve(this.state.name);
            } else {
                resolve(this.state.initialCategoryParameters.name);
            }
        });

        const promiseCover = new Promise(async (resolve, reject) => {
            if (updatedCategoryParameters.isCoverUpdated) {
                await this.uploadFileToCloudinary(this.dragAndDropRef.current.state.file);
                resolve(this.state.cover);
            } else {
                resolve(this.state.initialCategoryParameters.cover);
            }
        })

        const promiseCategory = new Promise(async (resolve, reject) => {
            let categoryArray = [];
            // categoryArray.push(this.state.name);
            
            await savedCategories.forEach(element => {
                if (this.categoryToggleRef.current.state.toggleList[element.name] === true) {
                    if (element.name === this.state.initialCategoryParameters.name) {
                        categoryArray.push(this.state.name);
                    } else {
                        categoryArray.push(element.name);
                    }
                }
            });
        
            await this.setState({ 
                category: categoryArray
            });

            if (updatedCategoryParameters.isCategoryUpdated) {
                resolve(this.state.category);
            } else {
                resolve(this.state.initialCategoryParameters.category);
            }
        });

        const promiseIsVisible = new Promise((resolve, reject) => {
            if (updatedCategoryParameters.isVisibleUpdated) {
                resolve(this.state.isVisible);
            } else {
                resolve(this.state.initialCategoryParameters.isVisible);
            }
        });

        const promiseIsCentered = new Promise((resolve, reject) => {
            if (updatedCategoryParameters.isCenteredUpdated) {
                resolve(this.state.isCentered);
            } else {
                resolve(this.state.initialCategoryParameters.isCentered);
            }
        });

        const promiseUrl = new Promise((resolve, reject) => {
            if (updatedCategoryParameters.isUrlUpdated) {
                resolve(this.state.url);
            } else {
                resolve(this.state.initialCategoryParameters.url);
            }
        });

        const promiseOrder = new Promise(async (resolve, reject) => {
            if (updatedCategoryParameters.isOrderUpdated) {
                // Swap categories order
                let prevOrder;
                prevOrder = this.state.initialCategoryParameters.order;
                
                let newOrder = this.state.order;

                let categoryToChange;
                for (let i=0; i<this.state.savedCategories.length; i++) {
                    // /!\ Parse order to int /!\
                    if (this.state.savedCategories[i].order === parseInt(newOrder)) {
                        categoryToChange = this.state.savedCategories[i];
                    }
                }        

                let cateogryToChangePayload = { name, category, cover, isVisible, isCentered, url, order };
                cateogryToChangePayload.name = categoryToChange.name;
                cateogryToChangePayload.category = categoryToChange.category;
                cateogryToChangePayload.isVisible = categoryToChange.isVisible;
                cateogryToChangePayload.isCentered = categoryToChange.isCentered;
                cateogryToChangePayload.cover = categoryToChange.cover;
                cateogryToChangePayload.url = categoryToChange.url;
                cateogryToChangePayload.order = prevOrder;

                let cateogryToChangeId = categoryToChange._id;

                await api.updateCategoryById(cateogryToChangeId, cateogryToChangePayload)
                .then(res => {
                    resolve(this.state.order);
                }).catch((error) => {
                    console.error(error);
                    window.alert(`La modification de la catégorie a échouée`);
                });
            } else {
                resolve(this.state.initialCategoryParameters.order);
            }
        });

        let payload = { name, category, cover, isVisible, isCentered, url, order };

        Promise.all([promiseName, promiseCategory, promiseIsVisible, promiseIsCentered, promiseCover, promiseUrl, promiseOrder])
        .then((values) => {
            // console.log(values);

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
            if (Object.values(updatedCategoryParameters).every((param) => {
                return param === false;
                })
            ) {
                this.setState({
                    isUploading: false
                });
        
                alert("Aucun paramètre n'a été modifié, mise à jour non effectuée.")
            } else {
                // /!\ DATABASE OVERWRITE IF NOT CAREFUL, PROCEED WITH CAUTION /!\
                // if (payload.isCentered === true) {
                //     this.state.savedCategories.forEach(async category => {
                //         let tempResult = result;
                //         tempResult.isCentered = false;
                //     });
                // }

                await api.updateCategoryById(this.state.id, result)
                .then(res => {
                    this.setState({
                        // name: '',
                        // category: '',
                        // cover: '',
                        // isVisible: true,
                        // isCentered: false,
                        // url: '',
                        // order: '',
                        isUploading: false
                    });

                    window.alert(`Catégorie modifiée avec succès`);
                }).catch((error) => {
                    this.setState({
                        isUploading: false
                    });

                    console.error(error);
                    window.alert(`La modification de la catégorie a échouée`);
                });
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            history.push(process.env.PUBLIC_URL + "/admin/categories/list");
            window.location.reload(true);
        });
    }

    deleteCategory = async () => {
        if (
            window.confirm(
                //`Voulez-vous supprimer ${this.state.id} définitivement ?`,
                "Voulez-vous supprimer cette catégorie définitivement ?",
            )
        ) {
            await new Promise(async (resolve, reject) => {
                await api.deleteCategoryById(this.state.id)
                .then(() => {
                    resolve();
                }).then(() => {

                }).catch((error) => {
                    console.error(error);
                }).finally(() => {

                });
            }).then(async () => {
                await alert("Catégorie supprimée avec succès !");
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                history.push(process.env.PUBLIC_URL + "/admin/categories/list");
                window.location.reload(true);
            });
        }
    }

    render() {
        const { name, category, cover, url, order, isVisible, isCentered } = this.state;

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
                                            <DragAndDropCover ref={this.dragAndDropRef} coverPreview={cover} />
                                        </CloudinaryContext>
                                    </section>

                                    { Object.keys(this.state.toggleList).length > 0 && (
                                        <section id="category-insert-categories" className="category-insert-section">
                                            <p id="category-toggle-title">{this.state.savedCategories.length} CATÉGORIES DISPONIBLES</p>
                                            <CategoryUpdateToggle onChange={this.handleChangeCategorySwitch} categories={this.state.savedCategories} selectedCategory={category} toggleList={this.state.toggleList} ref={this.categoryToggleRef} />
                                        </section>
                                    )}
                                    <section id="category-insert-url-visible" className="category-insert-section">
                                        {/* <input id="category-url-input" className="form-control" type="text" value={url} placeholder="URL" onChange={this.handleChangeInputUrl} /> */}
                                        
                                        <form id="category-order-form">
                                            <label>ORDER</label>
                                            <select id="category-order-select" value={order} onChange={this.handleChangeInputOrder}>
                                                {this.state.savedCategories.map((item, key) =>
                                                    <option key={item.name} value={item.order}>{item.order}</option>
                                                )}
                                            </select>
                                        </form>

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
                                        <button id="category-button-save" className="btn btn-primary" onClick={this.uploadCategory}>UPDATE</button>
                                        <Link to="/admin/categories/list" id="category-button-cancel" className="btn btn-warning mr-3">CANCEL</Link>
                                        <button id="category-button-delete" className="btn btn-danger" onClick={this.deleteCategory}>DELETE</button>
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

export default CategoryUpdate;