
import { FastMCP } from './src/lib/utils/fastmcp.js';

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
  
  // Create a flowchart slide
  mcp.createSlide('Flowchart');
  mcp.createFlowchartFromMermaid(`flowchart TD
  A[Data Collection] --> B[Preprocessing]
  B --> C[Feature Extraction]
  C --> D[Model Training]
  D --> E[Evaluation]
  E --> F{Performance\nSatisfactory?}
  F -->|Yes| G[Deploy Model]
  F -->|No| H[Hyperparameter Tuning]
  H --> D`, {"A":"📊","B":"🧹","C":"🔍","D":"🧠","E":"📈","F":"❓","G":"🚀","H":"⚙️"});
  
  // Get the visual representation
  const visualRepresentation = mcp.getVisualRepresentation();
  console.log('Visual representation:', JSON.stringify(visualRepresentation, null, 2));
  
  // Generate the PowerPoint file
  const pptxBuffer = await mcp.generateBuffer();
  
  // Save the PowerPoint file
  const fs = await import('fs');
  fs.writeFileSync('test-flowchart.pptx', pptxBuffer);
  
  console.log('PowerPoint file saved to test-flowchart.pptx');
}

testFastMCP();
    