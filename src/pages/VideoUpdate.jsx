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
            id: this.props.match.params.id,
            title: '',
            url: '',
            category: '',
            savedCategories: [],
            categoriesSelectItems: [],
            isLoading: true
        }
    }

    componentDidMount = async () => {
        const { id } = this.state;
        const video = await api.getVideoById(id)

        this.setState({
            title: video.data.data.title,
            url: video.data.data.url,
            category: video.data.data.category
        })
        
        await api.getAllCategories().then(categories => {
            this.setState({
                savedCategories: categories.data.data,
            });
        })

        await new Promise((resolve, reject) => {
            resolve(this.state.savedCategories);
        }).then((result) => {
            const optionsList = result.map((category) =>
                <option value={category.name} key={category.name.toString()}>{category.name}</option>
            );

            this.setState({
                categoriesSelectItems: optionsList,
                isLoading: false
            })
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
    
        }); 
    }

    componentWillUnmount() {

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
        const { id, title, url, category } = this.state;
        const payload = { title, url, category }

        await new Promise((resolve, reject) => {
            api.updateVideoById(id, payload)
            .then(res => {
                window.alert(`Vidéo mise à jour avec succès`);
                resolve();
            })
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            history.push(process.env.PUBLIC_URL + "/admin/videos/list");
            window.location.reload(true);
        })    
    }

    render() {
        const { title, url, category } = this.state;
        return (
            <div id="video-upload-container">
                {!this.state.isLoading && (
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
                            {/* <option value="MUSIC">MUSIC</option>
                            <option value="RAP">RAP FR</option>
                            <option value="SKATE">SKATEBOARD</option> */}
                            {this.state.categoriesSelectItems}
                        </Select>

                        <div className="mt-4">
                            <Button onClick={this.handleUpdateVideo}>UPDATE VIDEO</Button>
                            <Link to="/admin/videos/list" className="btn btn-warning"> CANCEL </Link>
                        </div>
                    </Wrapper>
                )}
            </div>
        )
    }
}

export default VideoUpdate;
