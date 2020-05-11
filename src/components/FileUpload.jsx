import React from 'react'

class FileUpload extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			file: null
		}

		this.onFileUpload = this.onFileUpload.bind(this)
		this.handleFileSelect = this.handleFileSelect.bind(this)
		this.handleDragOver = this.handleDragOver.bind(this)
	}

	onFileUpload() {
		let files = document.getElementById('file-input').files;

		if (!files.length) {
			alert('Please select a file!');
			return;
		}
	
		let file = files[0];
		let start = 0;
		let stop = file.size - 1;
	
		let reader = new FileReader();
	
		let blob = file.slice(start, stop + 1);
		reader.readAsBinaryString(blob);

		let result;

		new Promise((resolve, reject) => {
			// If we use onloadend, we need to check the readyState.
			reader.onloadend = function (e) {
				if (e.target.readyState === FileReader.DONE) { // DONE == 2
					result = JSON.parse(e.target.result);
					
					resolve();
				}
			};
		}).then(() => {
			this.setState({
				data: result
			});

			console.log(this.state.data);
		}).catch((error) => {
			console.error(error);
		}).finally(() => {

		});
	}

	handleFileSelect(e) {
		e.stopPropagation();
		e.preventDefault();
	
		// files is a FileList of File objects
		let files = e.dataTransfer.files;
	
		let output = [];
		for (let i = 0, f; f = files[i]; i++) {
		  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
					  f.size, ' bytes, last modified: ',
					  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
					  '</li>');
		}
		document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
	}
	
	handleDragOver(e) {
		e.stopPropagation();
		e.preventDefault();
		// Explicitly show this is a copy
		e.dataTransfer.dropEffect = 'copy';
	}	

	// ADD DRAG & DROP ZONE
	render() {
		// Check if File API is supported
		if (window.File && window.FileReader && window.Blob) {
			return (
				<div id="form-upload">
					<h1>FILE UPLOAD</h1>
					{/* <input type="file" id="file-input" onChange={this.onChange} />
					<button type="submit">Upload</button> */}

					<div id="drop-area" onDragOver={this.handleDragOver} onDrop={this.handleFileSelect}>DROP FILE HERE</div>

					<input id="file-input" type="file" name="file" />
					<button className="upload-button" onClick={this.onFileUpload}>UPLOAD</button>

					<output id="list"></output>
				</div>
			)	
		} else {
			return;
  		}
	}
}

export default FileUpload;