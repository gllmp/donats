import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import api from '../api';

import styled from 'styled-components';

import '../assets/styles/react-table-inverted.css';
import { Checkbox } from '@material-ui/core';

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
                await api.deleteVideoById(this.props.id).then( () => {
                    resolve();
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
        }

        this.reactTableRef = React.createRef();


        this.onPageChange = this.onPageChange.bind(this);
        this.onSelectAllPageCheckboxes = this.onSelectAllPageCheckboxes.bind(this);
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

    componentDidMount = async () => {
        
        await api.getAllVideos().then(videos => {
            this.setState({
                videos: videos.data.data,
                isLoading: false,
            })
        }).then(() => {
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
            
        }).catch((error) => {
            console.error(error);
        }).finally(() => {

        });
    }

    render() {
        const { videos, isLoading } = this.state;

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
