import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { history } from '../utils';
import api from '../api';

import styled from 'styled-components';

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-insert',
})`

`

const Label = styled.label`

`

const InputText = styled.input.attrs({
    className: 'form-control',
})`

`

const Select = styled.select.attrs({
    className: 'form-control',
})`

`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

class VideoUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            _id: this.props.match.params.id,
            title: '',
            url: '',
            category: '',
        }
    }
    

    handleChangeInputTitle = async event => {
        const title = event.target.value;
        this.setState({ title });
    }

    handleChangeInputUrl = async event => {
        const url = event.target.value;
        this.setState({ url });
    }
    
    handleChangeInputCategory = async event => {
        const category = event.target.value;
        this.setState({ category });
    }

    handleUpdateVideo = async () => {
        const { _id, title, url, category } = this.state;
        const payload = { title, url, category }

        new Promise((resolve, reject) => {
            api.updateVideoById(_id, payload)
            .then(res => {
                window.alert(`Video updated successfully`);
                resolve();
            })
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            history.push(process.env.PUBLIC_URL + "/admin/videos/list");
            window.location.reload(true);
        })    
    }

    componentDidMount = async () => {
        const { _id } = this.state;
        const video = await api.getVideoById(_id)

        this.setState({
            title: video.data.data.title,
            url: video.data.data.url,
            category: video.data.data.category,
        })
    }

    render() {
        const { title, url, category } = this.state;
        return (
            <Wrapper className="col-sm-4 offset-md-4 update-form">
                <Title className="mb-4" >UPDATE VIDEO</Title>

                <Label>TITLE: </Label>
                <InputText
                    type="text"
                    value={title}
                    onChange={this.handleChangeInputTitle}
                />

                <Label className="mt-4">URL: </Label>
                <InputText
                    type="text"
                    value={url}
                    onChange={this.handleChangeInputUrl}
                />

                <Label className="mt-4">CATEGORY: </Label>
                <Select
                    type="text"
                    value={category}
                    onChange={this.handleChangeInputCategory}
                >
                    <option value="" hidden></option>
                    <option value="MUSIC">MUSIC</option>
                    <option value="RAP">RAP FR</option>
                    <option value="SKATE">SKATEBOARD</option>
                </Select>

                <div className="mt-4">
                    <Button onClick={this.handleUpdateVideo}>UPDATE VIDEO</Button>
                    <Link to="/admin/videos/list" className="btn btn-danger"> CANCEL </Link>
                </div>
            </Wrapper>
        )
    }
}

export default VideoUpdate;
