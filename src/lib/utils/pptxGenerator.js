import pptxgen from 'pptxgenjs';

/**
 * Create a PowerPoint presentation with a flowchart
 * @param {Object} flowchartData - The flowchart data
 * @param {string} flowchartData.mermaid - The Mermaid code
 * @param {string} flowchartData.summary - The summary text
 * @param {Object} emojiMap - Map of node IDs to emojis
 * @returns {pptxgen} - The PowerPoint presentation object
 */
export function createFlowchartPresentation(flowchartData, emojiMap = {}) {
  const pptx = new pptxgen();
  
  // Add a title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText("Flowchart Presentation", { 
    x: 1, 
    y: 1, 
    w: 8, 
    h: 1, 
    fontSize: 24, 
    bold: true,
    align: 'center'
  });
  
  titleSlide.addText(flowchartData.summary, { 
    x: 1, 
    y: 2.5, 
    w: 8, 
    h: 2, 
    fontSize: 14,
    align: 'center'
  });
  
  // Add a flowchart slide
  const flowchartSlide = pptx.addSlide();
  flowchartSlide.addText("Flowchart", { 
    x: 0.5, 
    y: 0.5, 
    fontSize: 18, 
    bold: true 
  });
  
  // We'll add placeholder text for the flowchart
  // In a real implementation, we would convert the Mermaid code to shapes
  flowchartSlide.addText("Flowchart will be generated here", { 
    x: 1, 
    y: 1.5, 
    w: 8, 
    h: 4, 
    fontSize: 12,
    align: 'center',
    fill: { color: 'F2F2F2' }
  });
  
  return pptx;
}

/**
 * Generate a PowerPoint file and return it as a buffer
 * @param {Object} flowchartData - The flowchart data
 * @param {Object} emojiMap - Map of node IDs to emojis
 * @returns {Promise<Buffer>} - The PowerPoint file as a buffer
 */
export async function generatePowerPointBuffer(flowchartData, emojiMap = {}) {
  const pptx = createFlowchartPresentation(flowchartData, emojiMap);
  return await pptx.writeFile({ outputType: 'nodebuffer' });
}