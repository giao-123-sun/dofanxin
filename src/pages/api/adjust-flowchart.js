import { FastMCP } from '../../lib/utils/fastmcp.js';
import { parseMermaidFlowchart } from '../../lib/utils/mermaidParser.js';

export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { mermaid, currentState, adjustments } = data;
    
    if (!mermaid || !adjustments) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the Mermaid code to understand the flowchart structure
    const parsedFlowchart = parseMermaidFlowchart(mermaid);
    
    // Create a new MCP instance
    const mcp = new FastMCP();
    mcp.createSlide('Adjusted Flowchart');
    
    // If we have a current state, try to restore it
    if (currentState && currentState.elements) {
      // Restore the current state (simplified)
      // In a real implementation, we would restore the exact state
    }
    
    // First, create the flowchart from the Mermaid code
    mcp.createFlowchartFromMermaid(mermaid, {});
    
    // Then apply the adjustments
    for (const adjustment of adjustments) {
      switch (adjustment.type) {
        case 'moveNode':
          // Move a node to a new position
          if (mcp.flowchartElements.has(adjustment.nodeId)) {
            const element = mcp.flowchartElements.get(adjustment.nodeId);
            element.options.x = adjustment.x;
            element.options.y = adjustment.y;
          }
          break;
          
        case 'resizeNode':
          // Resize a node
          if (mcp.flowchartElements.has(adjustment.nodeId)) {
            const element = mcp.flowchartElements.get(adjustment.nodeId);
            element.options.w = adjustment.width;
            element.options.h = adjustment.height;
          }
          break;
          
        case 'changeNodeStyle':
          // Change a node's style
          if (mcp.flowchartElements.has(adjustment.nodeId)) {
            const element = mcp.flowchartElements.get(adjustment.nodeId);
            if (adjustment.fill) {
              element.options.fill = { color: adjustment.fill };
            }
            if (adjustment.line) {
              element.options.line = { color: adjustment.line, width: adjustment.lineWidth || 1 };
            }
            if (adjustment.fontSize) {
              element.options.fontSize = adjustment.fontSize;
            }
          }
          break;
          
        case 'addNode':
          // Add a new node
          mcp.addShape('rectangle', adjustment.text, {
            id: adjustment.nodeId,
            x: adjustment.x || 1,
            y: adjustment.y || 1,
            w: adjustment.width || 2,
            h: adjustment.height || 1,
            fill: { color: adjustment.fill || '4472C4' },
            line: { color: adjustment.line || '2E528F', width: adjustment.lineWidth || 1 },
            fontSize: adjustment.fontSize || 12,
            color: adjustment.textColor || 'FFFFFF'
          });
          break;
          
        case 'addConnector':
          // Add a new connector
          mcp.addConnector(adjustment.fromId, adjustment.toId, {
            type: adjustment.arrowType || 'arrow',
            line: { 
              color: adjustment.lineColor || '2E528F', 
              width: adjustment.lineWidth || 1 
            }
          });
          break;
      }
    }
    
    // Get the updated visual representation
    const updatedVisualRepresentation = mcp.getVisualRepresentation();
    
    return new Response(JSON.stringify({
      success: true,
      visualRepresentation: updatedVisualRepresentation
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error adjusting flowchart:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}