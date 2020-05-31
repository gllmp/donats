import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import api from '../api';

class UpdateVideo extends Component {
    render() {
        return <Link className="updateLink" to={`/admin/categories/update/${this.props.id}`}>Update</Link>
    }
}

class DeleteVideo extends Component {
    deleteEntry = async () => {
        if (
            window.confirm(
                //`Voulez-vous supprimer ${this.props.id} définitivement ?`,
                "Voulez-vous supprimer cette catégorie définitivement ?",
            )
        ) {
            await new Promise(async (resolve, reject) => {
                await api.deleteCategoryById(this.props.id).then( () => {
                    resolve();
                });    
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                window.location.reload(true);
            });
        }        
    }


    render() {
        return <Link className="deleteLink" to={`/admin/categories/list`} onClick={this.deleteEntry}>Delete</Link>
    }
}

class CategoryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            swiper: null,
            categories: [],
            covers: [],
            isLoading: false,
        }

                      
        this.params = {
            slidesPerView: 3,
            spaceBetween: 40,
            speed: 300,
            initialSlide: 3,
            centeredSlides: true,
            prevenClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: true,
            loop: false,
            navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
            },
            // pagination: {
            //   el: '.swiper-pagination',
            //   clickable: true,
            //   type: 'bullets',
            //   dynamicBullets: true
            // },
            // breakpoints: {
            //     1024: {
            //         slidesPerView: 3,
            //         spaceBetween: 40
            //     },
            //     768: {
            //         slidesPerView: 3,
            //         spaceBetween: 30
            //     },
            //     640: {
            //         slidesPerView: 2,
            //         spaceBetween: 20
            //     },
            //     320: {
            //         slidesPerView: 2,
            //         spaceBetween: 10
            //     }
            // },
            // on: {
            //     init: () => {
            //         console.log("INIT SWIPER");
            //     },
            //     click: (event) => {
                
            //     }
            // }      
        }

        this.updateSwiper = this.updateSwiper.bind(this);
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });

        await api.getAllCategories()
        .then(async (categories) => {
    
            await this.setState({
                categories: categories.data.data,
            });

            console.log("CATEGORIES LOADED: ", this.state.categories);
    
            return this.state.categories;
        }).then(async (categories) => {

            const categoriesCovers = categories.map((category) =>
                <div key={category.name.toString()}>
                    <img className="swiper-slide-image" data-playlist={category.name} src={category.cover} alt="category cover" />
                </div>
            );
    
            await this.setState({ 
                covers: categoriesCovers
            });

            console.log("COVERS LOADED: ", this.state.covers);

            return this.state;
        }).then(async (state) => {
            await this.setState({
                isLoading: false
            })

            console.log("STATE READY: ", this.state);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            
        });
    }

    componentWillUnmount() {

    }

    updateSwiper(swiper) {
        this.setState({ swiper });
    }
    
    render() {
        const {covers, isLoading} = this.state;

        return (                        
            <div id="category-list-wrapper">
                {!isLoading && (
                    <div id="category-list-container">
                        <div className="row">
                            <div className="col-lg">
                                <div className="align-items-center justify-content-center">                                    
                                    <h1 id="category-list-title">CATÉGORIES</h1>

                                    <div id="category-slider-container">
                                        <section className="category-list-section">
                                            <Swiper getSwiper={this.updateSwiper} {...this.params}>
                                                {covers}
                                            </Swiper>
                                        </section>

                                        <section className="category-list-section">
                                            <Swiper getSwiper={this.updateSwiper} {...this.params}>
                                                {covers}
                                            </Swiper>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default CategoryList;
