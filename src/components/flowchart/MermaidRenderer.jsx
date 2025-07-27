import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true
  }
});

export default function MermaidRenderer({ code, className = '' }) {
  const mermaidRef = useRef(null);
  const mermaidId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    if (mermaidRef.current && code) {
      try {
        mermaid.render(mermaidId.current, code).then(({ svg }) => {
          mermaidRef.current.innerHTML = svg;
        });
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        mermaidRef.current.innerHTML = `<div class="error">Error rendering diagram: ${error.message}</div>`;
      }
    }
  }, [code]);

  return (
    <div className={`mermaid-container ${className}`}>
      <div ref={mermaidRef} className="mermaid-diagram"></div>
    </div>
  );
}