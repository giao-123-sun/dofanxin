import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * Component to render Mermaid diagrams
 * @param {Object} props - Component props
 * @param {string} props.chart - Mermaid chart code to render
 * @param {string} props.id - Unique ID for the chart container
 */
export default function MermaidRenderer({ chart, id = 'mermaid-diagram' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!chart) return;

    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif'
    });

    // Render the chart
    const renderChart = async () => {
      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          const { svg } = await mermaid.render(id, chart);
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Error rendering Mermaid chart:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="error">Error rendering flowchart: ${error.message}</div>`;
        }
      }
    };

    renderChart();
  }, [chart, id]);

  return (
    <div className="mermaid-container">
      <div ref={containerRef} className="mermaid-diagram"></div>
      
      <style jsx>{`
        .mermaid-container {
          background-color: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
        }
        
        .mermaid-diagram {
          display: flex;
          justify-content: center;
          min-height: 200px;
        }
        
        .error {
          color: #e53e3e;
          padding: 1rem;
          border: 1px solid #fed7d7;
          border-radius: 0.375rem;
          background-color: #fff5f5;
        }
      `}</style>
    </div>
  );
}