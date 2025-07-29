import React, { useState } from 'react';

export default function FlowchartForm({ onSubmit, isLoading }) {
  const [inputType, setInputType] = useState('text');
  const [paperText, setPaperText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    if (inputType === 'text') {
      formData.append('paperText', paperText);
    } else {
      formData.append('pdfFile', pdfFile);
    }
    
    onSubmit(formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a valid PDF file');
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flowchart-form">
      <div className="input-type-selector">
        <label>
          <input
            type="radio"
            name="inputType"
            value="text"
            checked={inputType === 'text'}
            onChange={() => setInputType('text')}
          />
          Text Input
        </label>
        <label>
          <input
            type="radio"
            name="inputType"
            value="pdf"
            checked={inputType === 'pdf'}
            onChange={() => setInputType('pdf')}
          />
          PDF Upload
        </label>
      </div>

      {inputType === 'text' ? (
        <div className="text-input-container">
          <label htmlFor="paperText">Enter paper text:</label>
          <textarea
            id="paperText"
            value={paperText}
            onChange={(e) => setPaperText(e.target.value)}
            rows={10}
            placeholder="Paste the text content of your paper here..."
            required={inputType === 'text'}
          />
        </div>
      ) : (
        <div className="file-input-container">
          <label htmlFor="pdfFile">Upload PDF:</label>
          <input
            type="file"
            id="pdfFile"
            accept=".pdf"
            onChange={handleFileChange}
            required={inputType === 'pdf'}
          />
          {pdfFile && <p className="file-name">Selected file: {pdfFile.name}</p>}
        </div>
      )}

      <button type="submit" disabled={isLoading || (inputType === 'pdf' && !pdfFile) || (inputType === 'text' && !paperText)}>
        {isLoading ? 'Generating...' : 'Generate Flowchart'}
      </button>
    </form>
  );
}