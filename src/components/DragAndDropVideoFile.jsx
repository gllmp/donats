import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class DragAndDropVideoFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: "",
      name: "",
      type: "",
      size: "",
      data: "",
      hasLoaded: false
    };

    this.onDrop = this.onDrop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  componentDidMount() {
    this.dropzoneElement = document.getElementsByClassName("dropzone")[0];
  }

  componentWillUnmount() {

  }
  
  onDrop(acceptedFiles) {
    acceptedFiles.forEach((file) => {
      new Promise((resolve, reject) => {
        console.log("FILE: ", file);

        this.setState({
          file: file,
          name: file.name,
          type: file.type,
          size: file.size + " bytes",
          hasLoaded: true
        })

        resolve(this.state);
      }).then(() => {
        const reader = new FileReader();

        reader.onabort = () => console.log('File reading was aborted')
        reader.onerror = () => console.log('File reading has failed')
        reader.onload = (event) => {
          // Process file content          
          this.setState({
            data: JSON.parse(event.target.result)
          })
  
          //console.log(this.state.data);
        }

        reader.readAsText(this.state.file);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        document.getElementById("video-url-input").disabled = true;
        document.getElementById("video-category-select").disabled = true;

        console.log("SELECTED FILE: ", this.state);
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

  render() {
    return (
      <div id="video-dropzone-container">
        <Dropzone 
          onDrop={this.onDrop}
          accept="application/json"
        >
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
              <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    [<p key="text-active">D??posez votre fichier ici...</p>, this.handleDrag(isDragActive)] :
                    [<p key="text-inactive">Glissez et d??posez votre fichier ici, ou cliquez pour s??lectionner un fichier</p>, this.handleDrag(isDragActive)]
                }
                {isDragReject && "Ce type de fichier n'est pas accept??, d??sol?? !"}
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

export default DragAndDropVideoFile;