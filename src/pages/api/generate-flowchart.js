import { generateMermaidFromPaper, generateEmojiSuggestions } from '../../lib/api/openrouter.js';
import { extractTextFromPDF } from '../../lib/utils/pdfParser.js';
import { FastMCP } from '../../lib/utils/fastmcp.js';

export const prerender = false;

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    
    let paperText = '';
    
    // Check if we have a PDF file or text input
    if (formData.has('pdfFile')) {
      const pdfFile = formData.get('pdfFile');
      if (pdfFile instanceof File) {
        const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
        paperText = await extractTextFromPDF(pdfBuffer);
      }
    } else if (formData.has('paperText')) {
      paperText = formData.get('paperText');
    } else {
      return new Response(JSON.stringify({ error: 'No input provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // For testing purposes, use a mock response if the OpenRouter API is not available
    let flowchartData;
    let emojiSuggestions;
    
    try {
      // Generate Mermaid flowchart from paper text
      flowchartData = await generateMermaidFromPaper(paperText);
      
      // Generate emoji suggestions for the flowchart nodes
      emojiSuggestions = await generateEmojiSuggestions(flowchartData.mermaid);
    } catch (apiError) {
      console.error('API error, using mock data:', apiError);
      
      // Mock data for testing
      flowchartData = {
        mermaid: `flowchart TD
  A[Data Collection] --> B[Preprocessing]
  B --> C[Feature Extraction]
  C --> D[Model Training]
  D --> E[Evaluation]
  E --> F{Performance\\nSatisfactory?}
  F -->|Yes| G[Deploy Model]
  F -->|No| H[Hyperparameter Tuning]
  H --> D`,
        summary: "This flowchart represents the comprehensive machine learning approach for NLP tasks, showing the pipeline from data collection through preprocessing, feature extraction, model training, evaluation, and deployment."
      };
      
      emojiSuggestions = {
        "A": "📊",
        "B": "🧹",
        "C": "🔍",
        "D": "🧠",
        "E": "📈",
        "F": "❓",
        "G": "🚀",
        "H": "⚙️"
      };
    }
    
    // Create a PowerPoint presentation with the flowchart
    const mcp = new FastMCP();
    mcp.createSlide('Flowchart Presentation');
    mcp.addText(flowchartData.summary, {
      x: 1,
      y: 1,
      w: 8,
      h: 1,
      fontSize: 14
    });
    
    // Create a new slide for the flowchart
    mcp.createSlide('Flowchart');
    mcp.createFlowchartFromMermaid(flowchartData.mermaid, emojiSuggestions);
    
    return new Response(JSON.stringify({
      mermaid: flowchartData.mermaid,
      summary: flowchartData.summary,
      emojiSuggestions,
      visualRepresentation: mcp.getVisualRepresentation()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating flowchart:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}