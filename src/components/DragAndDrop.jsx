import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import categoryCover from '../assets/img/category-cover.png';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      type: "",
      size: "",
      file: "",
      data: "",
      src: "",
      preview: "",
    };

    this.onDrop = this.onDrop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
  componentDidMount() {
    this.setState({
      preview: categoryCover
    });

    this.dropzoneElement = document.getElementsByClassName("dropzone")[0];
  }

  onDrop(acceptedFiles) {
    const _this = this;

    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        console.log(file);
        
        const binaryStr = reader.result
        console.log(binaryStr)

        let imageSrc = require("../assets/img/" + file.path);

        let coverImage = document.getElementById("category-cover-image");
        coverImage.src = imageSrc;
      }
      
      reader.readAsArrayBuffer(file)
    })
  }

  handleDrag(dragActive) {
    if (this.dropzoneElement !== undefined) {
      if (dragActive) {
        this.dropzoneElement.style.opacity = "0.75";
        this.dropzoneElement.style.borderColor = "#2196f3";
      } else {
        this.dropzoneElement.style.opacity = "1.0";
        this.dropzoneElement.style.borderColor = "#fff";
      }  
    }
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

    }
  }
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  render() {
    return (
      <section id="category-cover-container">
        <img id="category-cover-image" src={this.state.preview} alt="category cover" />
        <Dropzone 
          onDrop={this.onDrop}
          accept="image/jpeg, image/png"
        >
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
              <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    ( <p>Déposez votre fichier ici...</p>, this.handleDrag(isDragActive) ) :
                    ( <p>Glissez et déposez votre image ici, ou cliquez pour sélectionner un fichier</p>, this.handleDrag(isDragActive) )
                }
                {isDragReject && "Ce type de fichier n'est pas accepté, désolé !"}
                <div id="category-cover-files">
                  <p>File:</p>
                  <ul>
                    <li key={this.state.file.name}>
                      {this.state.file.name} - {this.state.size}
                    </li>
                  </ul>
                </div>
              </div>
          )}
        </Dropzone>
        {/* <button onClick={this.showImage}>SHOW</button> */}
      </section>
    );
  }
}

export default DragAndDrop;