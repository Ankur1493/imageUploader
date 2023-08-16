import React, { useState } from 'react';
import "./uploadSection.css";
import axios from "axios";

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(URL.createObjectURL(file));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };


  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
  
      try {
        const response = await axios.post("http://localhost:8000/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Add this line
          }
        });
        console.log(response.data.imageUrl);
      } catch (err) {
        console.log(err);
      }
    }
  };
  


  return (
    <div className='uploadSection'>
          <div className="info">
        <div className="headLine">Upload your Image</div>
        <div className="disclaimer">Files should be in jpeg, png...</div>
      </div>
      <div className={`uploadImg ${isDraggingOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {
          selectedFile ? <img src={selectedFile} alt="" /> : <img src="./uploadImg.svg" alt="" /> 
        }
      </div>

      <div className="buttons">
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={(event) => handleFileSelect(event.target.files[0])}
        />
        <label htmlFor="fileInput" className='btns'>
          Choose a File
        </label>
        <button className='btns' onClick={handleUpload}>Upload Image</button>
      </div>

    </div>
  );
}

export default UploadSection;

