import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Compressor from 'compressorjs';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      type: "",
      size: "",
      file: "",
      data: "",
      preview: "https://res.cloudinary.com/donats/image/upload/v1590425039/category-cover_ulikx1.png",
      preview: "",
    };

    this.onDrop = this.onDrop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
    this.base64toBlob = this.base64toBlob.bind(this);
  }

  componentDidMount() {
    this.dropzoneElement = document.getElementsByClassName("dropzone")[0];
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    URL.revokeObjectURL(this.state.preview);
  }

  onDrop(acceptedFiles) {
    const _this = this;

    acceptedFiles.forEach((file) => {
      new Promise((resolve, reject) => {
        //console.log("FILE: ", file);

        // compress image file
        new Compressor(file, {
          quality: 0.6,
          success(fileCompressed) {
            //console.log("COMPRESSED: ", fileCompressed);
            let compressedSize = file.size - fileCompressed.size;
            compressedSize = Math.floor((compressedSize * 100) / file.size);
            console.log("COMPRESSED SIZE: ", compressedSize + "%")

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
          // Process file content
          //console.log("FILE READER: ", reader);

          // encode compressed file
          let base64String = _this.arrayBufferToBase64(reader.result);
          //console.log("BASE64 ENCODED STR: ", base64String);

          let imageSrc = "data:" + this.state.type + ";base64," + base64String;      

          _this.setState({
            data: reader.result,
            src: imageSrc
          })

          console.log("UPLOADED FILE: ", _this.state);
        }

        reader.readAsArrayBuffer(this.state.file);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {

      });    
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

  render() {
    return (
      <div id="category-cover-container">
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
                    [<p key="text-active">Déposez votre fichier ici...</p>, this.handleDrag(isDragActive)] :
                    [<p key="text-inactive">Glissez et déposez votre image ici, ou cliquez pour sélectionner un fichier</p>, this.handleDrag(isDragActive)]
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
      </div>
    );
  }
}

export default DragAndDrop;