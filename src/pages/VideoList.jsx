import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import api from '../api';

import styled from 'styled-components';

import '../assets/styles/react-table-inverted.css';

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
                `Do you want to delete the video ${this.props.id} permanently?`,
            )
        ) {
            new Promise((resolve, reject) => {
                api.deleteVideoById(this.props.id).then( () => {
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
        return <Link className="deleteLink" to={`/admin/videos/list`} onClick={this.deleteEntry} > Delete </Link>
    }
}

class VideoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        
        await api.getAllVideos().then(videos => {
            this.setState({
                videos: videos.data.data,
                isLoading: false,
            })
        })
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
                filterable: false,
            },
            {
                Header: 'URL',
                accessor: 'url',
                filterable: false,
            },
            {
                Header: 'CATEGORY',
                accessor: 'category',
                filterable: false
            },
            {
                Header: '',
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
                Header: '',
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
        ]

        let showTable = true;
        if (!videos.length) {
            showTable = false;
        }

        return (
            <Wrapper className="col-sm-8 offset-sm-2">
                {showTable && (
                    <ReactTable
                        data={videos}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={50}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default VideoList;
