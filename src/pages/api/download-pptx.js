import { FastMCP } from '../../lib/utils/fastmcp.js';
import { applyEmojisToMermaid } from '../../lib/utils/mermaidParser.js';

export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { mermaid, summary, emojiSuggestions } = data;
    
    if (!mermaid) {
      return new Response(JSON.stringify({ error: 'No Mermaid code provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Apply emojis to the Mermaid code if provided
    const mermaidWithEmojis = emojiSuggestions 
      ? applyEmojisToMermaid(mermaid, emojiSuggestions)
      : mermaid;
    
    // Create a PowerPoint presentation with the flowchart
    const mcp = new FastMCP();
    
    // Add title slide
    mcp.createSlide('Flowchart Presentation');
    mcp.addText(summary || 'Generated Flowchart', {
      x: 1,
      y: 1,
      w: 8,
      h: 1,
      fontSize: 14
    });
    
    // Add flowchart slide
    mcp.createSlide('Flowchart');
    mcp.createFlowchartFromMermaid(mermaidWithEmojis, emojiSuggestions || {});
    
    // Generate the PowerPoint file
    const pptxBuffer = await mcp.generateBuffer();
    
    return new Response(pptxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': 'attachment; filename="flowchart.pptx"'
      }
    });
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}