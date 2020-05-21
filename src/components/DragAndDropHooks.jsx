import React,  {useState, useEffect, useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import Compressor from 'compressorjs';
import { Base64 } from 'js-base64';
import categoryCover from '../assets/img/category-cover.png';

const activeStyle = {
  borderColor: '#2196f3',
  opacity: 0.75
};

// const contentType = 'image/png';
// const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

// const blob = b64toBlob(b64Data, contentType);
// const blobUrl = URL.createObjectURL(blob);

// const img = document.createElement('img');
// img.src = blobUrl;
// document.body.appendChild(img);


export default function DragAndDrop (props) {
  const [image, setImage] = useState({
    name: "",
    type: "",
    file: "",
    data: "",
    preview: categoryCover
  });

  useEffect(() => {
    console.log("IMAGE: ", image);

    // Make sure to revoke the data uris to avoid memory leaks
    URL.revokeObjectURL(image.preview);
  }, [image]);
   
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      new Promise((resolve, reject) => {
        resolve();
      }).then(() => {
        // compress image file
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            console.log("COMPRESSED: ", result);

            // var urlCreator = window.URL || window.webkitURL;
            // const imageUrl = urlCreator.createObjectURL(blob);
            // const img = document.querySelector('img');
            // img.addEventListener('load', () => URL.revokeObjectURL(imageUrl));
            // document.querySelector('img').src = imageUrl;

            
            // const encodedString = Base64.encode(result.name);

            // const blob = b64toBlob(encodedString, result.type);
            // const urlCreator = window.URL || window.webkitURL;
            // const blobUrl = urlCreator.createObjectURL(blob);

            // console.log("BLOB: ", blob);
            // console.log("BLOB URL: ", blobUrl);


            const urlCreator = window.URL || window.webkitURL;

            setImage({
              ...image,
              name: result.name,
              type: result.type,
              file: result,
              preview: urlCreator.createObjectURL(result)
            })

            // encode compressed file
            // const encodedString = Base64.encode(result.name);

            // const blob = b64toBlob(encodedString, result.type);
            // console.log("BLOB: ", blob);            
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
          console.log("READER: ", reader);

          //const binaryStr = reader.result;
          //console.log(binaryStr);
  
  
  
          //let imageSrc = require("../assets/img/" + file.name);
  
          //let coverImage = document.getElementById("category-cover-image");
          //coverImage.src = imageSrc;
        }

        console.log(file)
        console.log(image.file)
        reader.readAsArrayBuffer(file);
        //reader.readAsText(image.file);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {

      });    
    })
    
  }, []);

  const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop
  });

  const style = useMemo(() => ({
    ...(isDragActive ? activeStyle : {}),
  }), [
    isDragActive,
  ]);
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
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

  return (
    <section id="category-cover-container">
      <img id="category-cover-image" src={image.preview} alt="category cover" />
      <div {...getRootProps({className: 'dropzone', style})}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Déposez votre fichier ici...</p> :
            <p>Glissez et déposez votre image ici, ou cliquez pour sélectionner un fichier</p>
        }
        <div id="category-cover-files">
          <p>File:</p>
          <ul>{files}</ul>
        </div>
      </div>
    </section>
  );
}