import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Compressor from 'compressorjs';
//import { Base64 } from 'js-base64';
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
    this.base64toBlob = this.base64toBlob.bind(this);
    // this.showImage = this.showImage.bind(this);
  }

  componentDidMount() {
    this.setState({
      preview: categoryCover
    });

    this.dropzoneElement = document.getElementsByClassName("dropzone")[0];
  }

  onDrop(acceptedFiles) {
    const _this = this;

    acceptedFiles.forEach((file) => {
      new Promise((resolve, reject) => {
        console.log("FILE: ", file);

        // compress image file
        new Compressor(file, {
          quality: 0.6,
          success(fileCompressed) {
            console.log("COMPRESSED: ", fileCompressed);

            _this.setState({
              name: fileCompressed.name,
              type: fileCompressed.type,
              size: fileCompressed.size + " bytes",
              file: fileCompressed,
              preview: URL.createObjectURL(fileCompressed)
            })

            resolve();
          },
          error(err) {
            console.log(err.message);
          },
        });
      }).then(() => {
        const reader = new FileReader();

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

  base64toBlob(base64Data, contentType='', sliceSize=512) {
    const byteCharacters = window.atob(base64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});

    return blob;
  }

  // showImage() {  
  //   let str = this.arrayBufferToBase64(this.state.data);
  //   console.log("BASE64 ENCODE: ", str);
  //   //let str2 = Base64.atob(str)
  //   let str2 = this.base64toBlob(str, this.state.type);
  //   console.log("BASE64 DECODE: ", str2);
  //   let img = document.createElement('img');
  //   img.src = "data:" + this.state.type + ";base64," + str;
  //   document.body.appendChild(img);

  //   console.log(img);
  // }

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