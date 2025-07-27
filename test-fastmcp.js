
import { FastMCP } from './src/lib/utils/fastmcp.js';
import { parseMermaidFlowchart } from './src/lib/utils/mermaidParser.js';

async function testFastMCP() {
  const mcp = new FastMCP();
  
  // Create a title slide
  mcp.createSlide('Flowchart Presentation');
  mcp.addText("This flowchart represents the comprehensive machine learning approach for NLP tasks, showing the pipeline from data collection through preprocessing, feature extraction, model training, evaluation, and deployment.", {
    x: 1,
    y: 1,
    w: 8,
    h: 1,
    fontSize: 14
  });
  
  // Create a simplified flowchart for testing
  const mermaidCode = `flowchart TD
  A[Data Collection]
  B[Preprocessing]
  C[Feature Extraction]
  D[Model Training]
  A --> B
  B --> C
  C --> D`;
  
  const emojiMap = {
    "A": "📊",
    "B": "🧹",
    "C": "🔍",
    "D": "🧠"
  };
  
  // Parse the Mermaid code to understand the structure
  console.log('Parsing Mermaid code...');
  const parsedFlowchart = parseMermaidFlowchart(mermaidCode);
  console.log('Parsed flowchart:', JSON.stringify(parsedFlowchart, null, 2));
  
  // Create a flowchart slide
  console.log('Creating flowchart slide...');
  mcp.createSlide('Flowchart');
  mcp.createFlowchartFromMermaid(mermaidCode, emojiMap);
  
  // Get the visual representation
  const visualRepresentation = mcp.getVisualRepresentation();
  console.log('Visual representation:', JSON.stringify(visualRepresentation, null, 2));
  
  // Generate the PowerPoint file
  console.log('Generating PowerPoint file...');
  const pptxBuffer = await mcp.generateBuffer();
  
  // Save the PowerPoint file
  const fs = await import('fs');
  fs.writeFileSync('test-flowchart.pptx', pptxBuffer);
  
  console.log('PowerPoint file saved to test-flowchart.pptx');
}

testFastMCP();
    