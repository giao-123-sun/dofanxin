import { useState } from 'react';
import FlowchartForm from './FlowchartForm';
import FlowchartVisualizer from './FlowchartVisualizer';

/**
 * Main application component for the flowchart generator
 */
export default function FlowchartApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flowchartData, setFlowchartData] = useState(null);
  
  /**
   * Handle form submission to generate a flowchart
   * @param {FormData} formData - Form data with paper text or PDF file
   */
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-flowchart', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成流程图时出错');
      }
      
      const data = await response.json();
      setFlowchartData(data);
    } catch (err) {
      console.error('Error generating flowchart:', err);
      setError(err.message || '生成流程图时出错');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle download of PowerPoint file
   */
  const handleDownload = async () => {
    if (!flowchartData) return;
    
    try {
      const response = await fetch('/api/download-pptx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mermaid: flowchartData.mermaid,
          summary: flowchartData.summary,
          emojiSuggestions: flowchartData.emojiSuggestions,
          visualRepresentation: flowchartData.visualRepresentation
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '下载PowerPoint时出错');
      }
      
      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'flowchart.pptx';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading PowerPoint:', err);
      setError(err.message || '下载PowerPoint时出错');
    }
  };

  return (
    <div className="flowchart-app">
      <div className="app-container">
        <div className="app-header">
          <h1>智研图谱 - 论文流程图生成器</h1>
          <p>上传论文或输入文本，自动生成专业流程图并导出为PowerPoint</p>
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>关闭</button>
          </div>
        )}
        
        <div className="app-content">
          {!flowchartData ? (
            <div className="form-container">
              <FlowchartForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          ) : (
            <div className="result-container">
              <FlowchartVisualizer 
                mermaidCode={flowchartData.mermaid}
                summary={flowchartData.summary}
                emojiSuggestions={flowchartData.emojiSuggestions}
                visualRepresentation={flowchartData.visualRepresentation}
                onDownload={handleDownload}
              />
              
              <div className="back-button-container">
                <button 
                  className="back-button"
                  onClick={() => setFlowchartData(null)}
                >
                  返回
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .flowchart-app {
          min-height: 100vh;
          background-color: #f7fafc;
          padding: 2rem 1rem;
        }
        
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .app-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .app-header h1 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .app-header p {
          color: #4a5568;
          font-size: 1.125rem;
        }
        
        .error-message {
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .error-message p {
          color: #e53e3e;
          margin: 0;
        }
        
        .error-message button {
          background: none;
          border: none;
          color: #e53e3e;
          font-weight: 500;
          cursor: pointer;
        }
        
        .app-content {
          display: flex;
          justify-content: center;
        }
        
        .form-container, .result-container {
          width: 100%;
          max-width: 800px;
        }
        
        .back-button-container {
          margin-top: 2rem;
          text-align: center;
        }
        
        .back-button {
          background-color: transparent;
          border: 1px solid #4299e1;
          color: #4299e1;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .back-button:hover {
          background-color: #ebf8ff;
        }
      `}</style>
    </div>
  );
}