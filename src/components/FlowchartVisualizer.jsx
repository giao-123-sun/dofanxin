import { useState } from 'react';
import MermaidRenderer from './MermaidRenderer';

/**
 * Component to visualize and enhance flowcharts
 * @param {Object} props - Component props
 * @param {string} props.mermaidCode - Mermaid flowchart code
 * @param {string} props.summary - Summary of the flowchart
 * @param {Object} props.emojiSuggestions - Emoji suggestions for nodes
 * @param {Object} props.visualRepresentation - Visual representation for PowerPoint
 * @param {Function} props.onDownload - Function to call when download button is clicked
 */
export default function FlowchartVisualizer({ 
  mermaidCode, 
  summary, 
  emojiSuggestions, 
  visualRepresentation,
  onDownload 
}) {
  const [enhancedMermaid, setEnhancedMermaid] = useState('');
  const [useEmojis, setUseEmojis] = useState(true);
  
  // Apply emoji enhancements to the Mermaid code
  const applyEmojiEnhancements = () => {
    if (!mermaidCode || !emojiSuggestions) return mermaidCode;
    
    let enhancedCode = mermaidCode;
    
    // Replace node labels with emoji-enhanced labels
    Object.entries(emojiSuggestions).forEach(([nodeId, emoji]) => {
      const nodePattern = new RegExp(`${nodeId}\\[(.*?)\\]`, 'g');
      enhancedCode = enhancedCode.replace(nodePattern, `${nodeId}[${emoji} $1]`);
    });
    
    return enhancedCode;
  };
  
  // Toggle emoji enhancements
  const toggleEmojis = () => {
    setUseEmojis(!useEmojis);
  };
  
  // Get the current Mermaid code to display
  const getCurrentMermaidCode = () => {
    if (useEmojis) {
      if (!enhancedMermaid) {
        const enhanced = applyEmojiEnhancements();
        setEnhancedMermaid(enhanced);
        return enhanced;
      }
      return enhancedMermaid;
    }
    return mermaidCode;
  };

  return (
    <div className="flowchart-visualizer">
      {summary && (
        <div className="summary">
          <h3>流程图概述</h3>
          <p>{summary}</p>
        </div>
      )}
      
      <div className="controls">
        <button 
          className={`control-button ${useEmojis ? 'active' : ''}`}
          onClick={toggleEmojis}
        >
          {useEmojis ? '隐藏表情符号' : '显示表情符号'}
        </button>
        
        <button 
          className="control-button download"
          onClick={onDownload}
        >
          下载PowerPoint
        </button>
      </div>
      
      <div className="flowchart-container">
        <h3>生成的流程图</h3>
        <MermaidRenderer chart={getCurrentMermaidCode()} id="flowchart-visualization" />
      </div>
      
      {emojiSuggestions && Object.keys(emojiSuggestions).length > 0 && (
        <div className="emoji-suggestions">
          <h3>表情符号建议</h3>
          <div className="emoji-grid">
            {Object.entries(emojiSuggestions).map(([nodeId, emoji]) => (
              <div key={nodeId} className="emoji-item">
                <span className="node-id">{nodeId}:</span>
                <span className="emoji">{emoji}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .flowchart-visualizer {
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .summary {
          margin-bottom: 2rem;
          padding: 1rem;
          background-color: #f7fafc;
          border-radius: 0.375rem;
        }
        
        .summary h3 {
          margin-top: 0;
          color: #2d3748;
        }
        
        .summary p {
          margin-bottom: 0;
          color: #4a5568;
          line-height: 1.6;
        }
        
        .controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .control-button {
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          background-color: white;
          color: #4a5568;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .control-button:hover {
          background-color: #f7fafc;
        }
        
        .control-button.active {
          background-color: #ebf8ff;
          border-color: #4299e1;
          color: #4299e1;
        }
        
        .control-button.download {
          background-color: #4299e1;
          color: white;
          border-color: #4299e1;
        }
        
        .control-button.download:hover {
          background-color: #3182ce;
        }
        
        .flowchart-container {
          margin-bottom: 2rem;
        }
        
        .flowchart-container h3 {
          margin-bottom: 1rem;
          color: #2d3748;
        }
        
        .emoji-suggestions {
          margin-top: 2rem;
        }
        
        .emoji-suggestions h3 {
          margin-bottom: 1rem;
          color: #2d3748;
        }
        
        .emoji-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;
        }
        
        .emoji-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background-color: #f7fafc;
          border-radius: 0.375rem;
        }
        
        .node-id {
          font-weight: 500;
          color: #2d3748;
        }
        
        .emoji {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}