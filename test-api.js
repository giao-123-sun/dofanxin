import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock data for testing
const mockFlowchartData = {
  mermaid: `flowchart TD
  A[Data Collection] --> B[Preprocessing]
  B --> C[Feature Extraction]
  C --> D[Model Training]
  D --> E[Evaluation]
  E --> F{Performance\\nSatisfactory?}
  F -->|Yes| G[Deploy Model]
  F -->|No| H[Hyperparameter Tuning]
  H --> D`,
  summary: "This flowchart represents the comprehensive machine learning approach for NLP tasks, showing the pipeline from data collection through preprocessing, feature extraction, model training, evaluation, and deployment.",
  emojiSuggestions: {
    "A": "📊",
    "B": "🧹",
    "C": "🔍",
    "D": "🧠",
    "E": "📈",
    "F": "❓",
    "G": "🚀",
    "H": "⚙️"
  },
  visualRepresentation: {
    elements: [
      {
        id: "A",
        type: "shape",
        text: "📊 Data Collection",
        position: { x: 1, y: 2, width: 2, height: 1 }
      },
      {
        id: "B",
        type: "shape",
        text: "🧹 Preprocessing",
        position: { x: 3.5, y: 2, width: 2, height: 1 }
      },
      {
        id: "connector_A_B",
        type: "connector",
        text: "",
        position: { x: 3, y: 2.5, width: 0.5, height: 0 }
      },
      // ... more elements
    ]
  }
};

function testGenerateFlowchart() {
  try {
    console.log('Testing with mock flowchart data...');
    
    // Save the mock data to a file for reference
    fs.writeFileSync(
      path.join(__dirname, 'mock-flowchart-data.json'),
      JSON.stringify(mockFlowchartData, null, 2)
    );
    
    console.log('Mock data saved to mock-flowchart-data.json');
    
    return mockFlowchartData;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function testMermaidRenderer() {
  try {
    console.log('Testing Mermaid renderer with mock data...');
    
    // Create an HTML file with the Mermaid code for testing
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mermaid Test</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({ startOnLoad: true });
  </script>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .mermaid {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
    .summary {
      margin-bottom: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h1>Mermaid Flowchart Test</h1>
  
  <div class="summary">
    <strong>Summary:</strong> ${mockFlowchartData.summary}
  </div>
  
  <div class="mermaid">
${mockFlowchartData.mermaid}
  </div>
  
  <h2>Emoji Suggestions</h2>
  <ul>
    ${Object.entries(mockFlowchartData.emojiSuggestions).map(([nodeId, emoji]) => 
      `<li><strong>${nodeId}:</strong> ${emoji}</li>`
    ).join('\n    ')}
  </ul>
</body>
</html>
    `;
    
    fs.writeFileSync(
      path.join(__dirname, 'mermaid-test.html'),
      htmlContent
    );
    
    console.log('Mermaid test HTML file saved to mermaid-test.html');
  } catch (error) {
    console.error('Error testing Mermaid renderer:', error.message);
  }
}

function testFastMCP() {
  try {
    console.log('Testing FastMCP with mock data...');
    
    // Create a simple test script for FastMCP
    const testScript = `
import { FastMCP } from './src/lib/utils/fastmcp.js';

async function testFastMCP() {
  const mcp = new FastMCP();
  
  // Create a title slide
  mcp.createSlide('Flowchart Presentation');
  mcp.addText("${mockFlowchartData.summary}", {
    x: 1,
    y: 1,
    w: 8,
    h: 1,
    fontSize: 14
  });
  
  // Create a flowchart slide
  mcp.createSlide('Flowchart');
  mcp.createFlowchartFromMermaid(\`${mockFlowchartData.mermaid}\`, ${JSON.stringify(mockFlowchartData.emojiSuggestions)});
  
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
    `;
    
    fs.writeFileSync(
      path.join(__dirname, 'test-fastmcp.js'),
      testScript
    );
    
    console.log('FastMCP test script saved to test-fastmcp.js');
    console.log('You can run it with: node test-fastmcp.js');
  } catch (error) {
    console.error('Error testing FastMCP:', error.message);
  }
}

function main() {
  testGenerateFlowchart();
  testMermaidRenderer();
  testFastMCP();
}

main();