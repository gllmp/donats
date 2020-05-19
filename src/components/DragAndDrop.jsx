import React,  {useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import categoryCover from '../assets/img/category-cover.png';

const activeStyle = {
  borderColor: '#2196f3',
  opacity: 0.75
};

export default function DragAndDrop (props) {
  const onDrop = useCallback((acceptedFiles) => {
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

  return (
    <section id="category-cover-container">
      <img id="category-cover-image" src={categoryCover} alt="category cover" />
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