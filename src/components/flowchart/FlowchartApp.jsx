import React, { useState } from 'react';
import FlowchartForm from './FlowchartForm';
import FlowchartVisualizer from './FlowchartVisualizer';

export default function FlowchartApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flowchartData, setFlowchartData] = useState(null);
  const [visualRepresentation, setVisualRepresentation] = useState(null);

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
        throw new Error(errorData.error || 'Failed to generate flowchart');
      }
      
      const data = await response.json();
      setFlowchartData(data);
      setVisualRepresentation(data.visualRepresentation);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (data) => {
    try {
      const response = await fetch('/api/download-pptx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download PowerPoint');
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
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdjust = async (mermaid, currentState, adjustments) => {
    try {
      const response = await fetch('/api/adjust-flowchart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mermaid,
          currentState,
          adjustments
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to adjust flowchart');
      }
      
      const data = await response.json();
      setVisualRepresentation(data.visualRepresentation);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flowchart-app">
      {!flowchartData && (
        <FlowchartForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
      
      {isLoading && (
        <div className="loading">
          <p>Generating flowchart... This may take a moment.</p>
        </div>
      )}
      
      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {flowchartData && (
        <>
          <FlowchartVisualizer
            mermaidCode={flowchartData.mermaid}
            summary={flowchartData.summary}
            emojiSuggestions={flowchartData.emojiSuggestions}
            visualRepresentation={visualRepresentation}
            onDownload={handleDownload}
            onAdjust={handleAdjust}
          />
          
          <button 
            className="reset-button"
            onClick={() => {
              setFlowchartData(null);
              setVisualRepresentation(null);
            }}
          >
            Start Over
          </button>
        </>
      )}
      
      <style jsx>{`
        .flowchart-app {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .loading, .error {
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
        }
        
        .loading {
          background-color: #f0f9ff;
          color: #0369a1;
        }
        
        .error {
          background-color: #fef2f2;
          color: #b91c1c;
        }
        
        .reset-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .reset-button:hover {
          background-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}