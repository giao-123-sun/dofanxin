import { useState } from 'react';

/**
 * Form component for submitting text or PDF to generate a flowchart
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {boolean} props.isLoading - Whether the form is currently submitting
 */
export default function FlowchartForm({ onSubmit, isLoading }) {
  const [paperText, setPaperText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    if (inputMethod === 'text') {
      formData.append('paperText', paperText);
    } else if (inputMethod === 'pdf' && pdfFile) {
      formData.append('pdfFile', pdfFile);
    }
    
    onSubmit(formData);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  return (
    <div className="flowchart-form">
      <h2>生成流程图</h2>
      <p>上传PDF论文或输入文本内容，我们将自动生成流程图。</p>
      
      <div className="input-method-selector">
        <button 
          type="button"
          className={`method-button ${inputMethod === 'text' ? 'active' : ''}`}
          onClick={() => setInputMethod('text')}
        >
          文本输入
        </button>
        <button 
          type="button"
          className={`method-button ${inputMethod === 'pdf' ? 'active' : ''}`}
          onClick={() => setInputMethod('pdf')}
        >
          PDF上传
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {inputMethod === 'text' ? (
          <div className="form-group">
            <label htmlFor="paperText">输入论文或文本内容：</label>
            <textarea
              id="paperText"
              value={paperText}
              onChange={(e) => setPaperText(e.target.value)}
              placeholder="粘贴论文或文本内容..."
              rows={10}
              required={inputMethod === 'text'}
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="pdfFile">上传PDF文件：</label>
            <input
              type="file"
              id="pdfFile"
              accept=".pdf"
              onChange={handleFileChange}
              required={inputMethod === 'pdf'}
            />
            {pdfFile && (
              <p className="file-info">已选择文件: {pdfFile.name}</p>
            )}
          </div>
        )}
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading || (inputMethod === 'pdf' && !pdfFile) || (inputMethod === 'text' && !paperText)}
        >
          {isLoading ? '生成中...' : '生成流程图'}
        </button>
      </form>
      
      <style jsx>{`
        .flowchart-form {
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          margin-top: 0;
          color: #2d3748;
        }
        
        .input-method-selector {
          display: flex;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .method-button {
          background: none;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          color: #4a5568;
          border-bottom: 2px solid transparent;
        }
        
        .method-button.active {
          color: #4299e1;
          border-bottom: 2px solid #4299e1;
          font-weight: 500;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2d3748;
        }
        
        textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-family: inherit;
          font-size: 1rem;
        }
        
        input[type="file"] {
          display: block;
          margin-top: 0.5rem;
        }
        
        .file-info {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #4a5568;
        }
        
        .submit-button {
          background-color: #4299e1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: #3182ce;
        }
        
        .submit-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}