import React, { useState, useEffect } from 'react';
import MermaidRenderer from './MermaidRenderer';

export default function FlowchartVisualizer({ 
  mermaidCode, 
  summary, 
  emojiSuggestions, 
  visualRepresentation,
  onDownload,
  onAdjust
}) {
  const [adjustedMermaid, setAdjustedMermaid] = useState(mermaidCode);
  const [adjustments, setAdjustments] = useState([]);
  const [showEmojiSuggestions, setShowEmojiSuggestions] = useState(true);

  useEffect(() => {
    setAdjustedMermaid(mermaidCode);
  }, [mermaidCode]);

  const handleDownload = () => {
    onDownload({
      mermaid: adjustedMermaid,
      summary,
      emojiSuggestions: showEmojiSuggestions ? emojiSuggestions : null
    });
  };

  const handleAdjustment = (type, params) => {
    const newAdjustment = { type, ...params };
    setAdjustments([...adjustments, newAdjustment]);
    
    onAdjust(adjustedMermaid, visualRepresentation, [newAdjustment]);
  };

  const toggleEmojiSuggestions = () => {
    setShowEmojiSuggestions(!showEmojiSuggestions);
  };

  return (
    <div className="flowchart-visualizer">
      <div className="flowchart-summary">
        <h3>Summary</h3>
        <p>{summary}</p>
      </div>
      
      <div className="flowchart-display">
        <h3>Mermaid Flowchart</h3>
        <MermaidRenderer code={adjustedMermaid} />
      </div>
      
      <div className="flowchart-controls">
        <div className="emoji-controls">
          <label>
            <input
              type="checkbox"
              checked={showEmojiSuggestions}
              onChange={toggleEmojiSuggestions}
            />
            Use Emoji Suggestions
          </label>
        </div>
        
        <div className="adjustment-controls">
          <h4>Adjust Flowchart</h4>
          <button onClick={() => handleAdjustment('changeNodeStyle', { 
            nodeId: Object.keys(emojiSuggestions)[0], 
            fill: '5B9BD5' 
          })}>
            Change First Node Color
          </button>
          <button onClick={() => handleAdjustment('resizeNode', { 
            nodeId: Object.keys(emojiSuggestions)[0], 
            width: 3, 
            height: 1.5 
          })}>
            Resize First Node
          </button>
        </div>
        
        <button className="download-button" onClick={handleDownload}>
          Download PowerPoint
        </button>
      </div>
      
      {emojiSuggestions && (
        <div className="emoji-suggestions">
          <h3>Emoji Suggestions</h3>
          <ul>
            {Object.entries(emojiSuggestions).map(([nodeId, emoji]) => (
              <li key={nodeId}>
                <strong>{nodeId}:</strong> {emoji}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}