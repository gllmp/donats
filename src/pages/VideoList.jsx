import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import api from '../api';

import styled from 'styled-components';

import '../assets/styles/react-table-inverted.css';
import { Checkbox } from '@material-ui/core';
import loadingCircle from '../assets/img/loading-circle.gif'

const Wrapper = styled.div`

`

class UpdateVideo extends Component {
    render() {
        return <Link className="updateLink" to={`/admin/videos/update/${this.props.id}`} > Update </Link>
    }
}

class DeleteVideo extends Component {
    deleteEntry = async () => {
        if (
            window.confirm(
                //`Voulez-vous supprimer ${this.props.id} définitivement ?`,
                "Voulez-vous supprimer cette vidéo définitivement ?",
            )
        ) {
            await new Promise(async (resolve, reject) => {
                await api.deleteVideoById(this.props.id)
                .then( () => {
                    resolve();
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {

                });
            }).then(async () => {
                await alert("Vidéo supprimée avec succès !");
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                window.location.reload(true);
            });
        }        
    }

    render() {
        return <Link className="deleteLink" to={`/admin/videos/list`} onClick={this.deleteEntry} > Delete </Link>
    }
}

class VideoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            columns: [],
            isLoading: true,
            isDeleting: false
        }

        this.reactTableRef = React.createRef();


        this.onPageChange = this.onPageChange.bind(this);
        this.onSelectAllPageCheckboxes = this.onSelectAllPageCheckboxes.bind(this);
        this.onDeleteSelectedItems = this.onDeleteSelectedItems.bind(this);
        this.createHeaderIcons = this.createHeaderIcons.bind(this);
    }

    onPageChange(page) {
        let selectCheckbox = document.getElementsByClassName("select-checkbox")[0];
        let linkCheckboxes = document.getElementsByClassName("link-checkbox");
    
        selectCheckbox.checked = false;
        
        for (let i=0; i<linkCheckboxes.length; i++) {
            linkCheckboxes[i].checked = false;
        }
    }

    onSelectAllPageCheckboxes(event) {
        let selectCheckbox = document.getElementsByClassName("select-checkbox")[0];
        let linkCheckboxes = document.getElementsByClassName("link-checkbox");
        // console.log(linkCheckboxes);

        for (let i=0; i<linkCheckboxes.length; i++) {
            linkCheckboxes[i].checked = selectCheckbox.checked;
        }

        // console.log("ReactTable: ", this.reactTableRef.current);

        // let currentPage = this.reactTableRef.current.state.page;
        // let pageSize = this.reactTableRef.current.state.pageSize;
        // let totalPages = this.reactTableRef.current.state.pages;
        // console.log("CURRENT PAGE: ", currentPage);
        // console.log("PAGE SIZE: ", pageSize);
        // console.log("TOTAL PAGES: ", totalPages);

        // let arr = Array.from(linkCheckboxes);
        // let temp = [];
        // let chunk;
        // for (let i=0; i<arr.length; i+=pageSize) {
        //     chunk = arr.slice(i, i+pageSize);
        //     temp.push(chunk);
        // }
        // console.log(linkCheckboxes.length)
    }

    onDeleteSelectedItems = async (event) => {
        // let selectCheckbox = document.getElementsByClassName("select-checkbox")[0];
        let linkCheckboxes = document.getElementsByClassName("link-checkbox");
        let selectedCheckboxes = [];
        let videoIds = [];
        let currentIdIndex = 0;

        for (let i=0; i<linkCheckboxes.length; i++) {
            if (linkCheckboxes[i].checked === true) {
                selectedCheckboxes.push(linkCheckboxes[i]);
            }
        }

        if (selectedCheckboxes.length) {
            if (
                window.confirm(
                    "Voulez-vous supprimer la sélection définitivement ?",
                )
            ) {
                this.setState({
                    isDeleting: true
                })

                await selectedCheckboxes.map(async (video) => {
                    videoIds.push(video.id);
                });
                
                Object.values(videoIds).forEach(async (id) => {
                    await new Promise(async (resolve, reject) => {
                        resolve(id);
                    }).then(async (id) => {
                        await api.deleteVideoById(id).then(async () => {
                            console.log("Vidéo: " + id + " supprimée avec succès !");
                        }).catch((error) => {
                            console.error(error);
                        }).finally(() => {

                        });
                    }).then(async () => {
                        
                    }).catch((error) => {
                        console.error(error);

                        this.setState({
                            isDeleting: false
                        })
                    }).finally(() => {
                        currentIdIndex++;

                        if (currentIdIndex === videoIds.length) {
                            this.setState({
                                isDeleting: false
                            })

                            alert("Sélection supprimée avec succès !")
                            window.location.reload(true);
                        }
                    });

                })
            }
        } else {
            alert("Aucun élément sélectionné");
        }
    }

    createHeaderIcons() {
        // Select Checkbox
        let selectHeaderElement = document.getElementsByClassName("rt-thead")[1].getElementsByClassName("rt-tr")[0].lastChild;
        selectHeaderElement.className = "select-header";

        let selectInputElement = document.createElement("input");
        selectInputElement.type = "checkbox";
        selectInputElement.className = "select-checkbox";
        selectInputElement.name = "select-checkbox";

        selectInputElement.onclick = (event) => {
            this.onSelectAllPageCheckboxes(event)
        }

        selectHeaderElement.appendChild(selectInputElement);

        // Bin Icon
        // let binSvgElement = document.createElement("svg");
        // binSvgElement.xmlns = "http://www.w3.org/2000/svg";
        // binSvgElement.width = 24;
        // binSvgElement.height = 24;
        // binSvgElement.viewBox = "0 0 24 24";
        // binSvgElement.className = "bin-icon";

        // let binPathElement = document.createElement("path");
        // binPathElement.d = "M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z";

        // binSvgElement.appendChild(binPathElement);

        // binSvgElement.onclick = (event) => {
        //     this.onDeleteSelectedItems(event)
        // }

        // console.log(binSvgElement)

        let domParser = new DOMParser();
        let svgString='<svg xmlns="http://www.w3.org/2000/svg" class="bin-icon" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>';
        let svgElement = domParser.parseFromString(svgString, "image/svg+xml");

        svgElement.documentElement.onclick = (event) => {
            this.onDeleteSelectedItems(event)
        }

        selectHeaderElement.appendChild(svgElement.documentElement);
    }

    componentDidMount = async () => {
        
        await api.getAllVideos().then(videos => {
            this.setState({
                videos: videos.data.data,
                isLoading: false,
            })
        }).then(() => {
            this.createHeaderIcons();

        }).catch((error) => {
            console.error(error);
        }).finally(() => {

        });
    }

    render() {
        const { videos, isLoading, isDeleting } = this.state;

        const columns = [
            // {
            //     Header: 'ID',
            //     accessor: '_id',
            //     filterable: false,
            // },
            {
                Header: 'TITLE',
                accessor: 'title',
                filterable: true,
                width: 300,
            },
            {
                Header: 'URL',
                accessor: 'url',
                filterable: true,
            },
            {
                Header: 'CATEGORY',
                accessor: 'category',
                filterable: true
            },
            {
                Header: 'UPDATE',
                accessor: '',
                className: 'gridCellLink',
                width: 100,
                Cell: function(props) {
                    return (
                        <span>
                            <UpdateVideo id={props.original._id} />
                        </span>
                    )
                },
            },
            {
                Header: 'DELETE',
                accessor: '',
                className: 'gridCellLink',
                width: 100,
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteVideo id={props.original._id} />
                        </span>
                    )
                },
            },
            {
                Header: 'SELECT',
                accessor: '',
                className: 'gridCellCheckbox',
                width: 100,
                Cell: function(props) {
                    return (
                        <input id={props.original._id} type="checkbox" className="link-checkbox" />
                    )
                },
            },
        ]

        let showTable = true;
        if (!videos.length) {
            showTable = false;
        }

        return (
            <Wrapper id="admin-list-container" className="col-sm-8 offset-sm-2">
                {this.state.isDeleting &&
                    <img className="loading-circle" alt="gif" src={loadingCircle} />
                }
                {showTable && (
                    <ReactTable
                        data={videos}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={100}
                        showPageSizeOptions={true}
                        minRows={0}
                        ref={this.reactTableRef}
                        onPageChange={this.onPageChange}
                    />
                )}
            </Wrapper>
        )
    }
}

export default VideoList;
