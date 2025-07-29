import pptxgen from 'pptxgenjs';
import { parseMermaidFlowchart } from './mermaidParser.js';

/**
 * FastMCP (Minimal Control Protocol) for PowerPoint
 * A simplified interface for AI to manipulate PowerPoint presentations
 */
export class FastMCP {
  constructor() {
    this.pptx = new pptxgen();
    this.currentSlide = null;
    this.flowchartElements = new Map();
    this.history = [];
  }

  /**
   * Create a new slide
   * @param {string} title - Optional slide title
   * @returns {Object} - The created slide
   */
  createSlide(title = '') {
    this.currentSlide = this.pptx.addSlide();
    
    if (title) {
      this.currentSlide.addText(title, {
        x: 0.5,
        y: 0.5,
        fontSize: 18,
        bold: true
      });
    }
    
    this.history.push({ action: 'createSlide', title });
    return this.currentSlide;
  }

  /**
   * Add text to the current slide
   * @param {string} text - The text to add
   * @param {Object} options - Text options (position, size, etc.)
   * @returns {Object} - The added text object
   */
  addText(text, options = {}) {
    if (!this.currentSlide) {
      this.createSlide();
    }
    
    const defaultOptions = {
      x: 1,
      y: 1,
      w: 8,
      h: 1,
      fontSize: 12
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    const textObj = this.currentSlide.addText(text, mergedOptions);
    
    this.history.push({ action: 'addText', text, options: mergedOptions });
    return textObj;
  }

  /**
   * Add a shape to the current slide
   * @param {string} type - Shape type (rect, ellipse, etc.)
   * @param {string} text - Text inside the shape
   * @param {Object} options - Shape options
   * @returns {Object} - The added shape
   */
  addShape(type, text, options = {}) {
    if (!this.currentSlide) {
      this.createSlide();
    }
    
    const defaultOptions = {
      x: 1,
      y: 1,
      w: 2,
      h: 1,
      fill: { color: '4472C4' },
      line: { color: '2E528F', width: 1 },
      fontSize: 12,
      color: 'FFFFFF'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // For pptxgenjs, we need to include the text in the options
    const optionsWithText = { ...mergedOptions, text };
    const shape = this.currentSlide.addShape(type, optionsWithText);
    
    const id = options.id || `shape_${Date.now()}`;
    this.flowchartElements.set(id, { 
      type: 'shape', 
      object: shape, 
      options: mergedOptions,
      text: text // Store the text separately for our visual representation
    });
    
    this.history.push({ action: 'addShape', type, text, options: mergedOptions, id });
    return shape;
  }

  /**
   * Add a connector between two shapes
   * @param {string} fromId - ID of the source shape
   * @param {string} toId - ID of the target shape
   * @param {Object} options - Connector options
   * @returns {Object} - The added connector
   */
  addConnector(fromId, toId, options = {}) {
    if (!this.currentSlide) {
      this.createSlide();
    }
    
    const fromElement = this.flowchartElements.get(fromId);
    const toElement = this.flowchartElements.get(toId);
    
    if (!fromElement || !toElement) {
      throw new Error(`Cannot find elements with IDs: ${fromId} and/or ${toId}`);
    }
    
    const defaultOptions = {
      type: 'arrow',
      line: { color: '2E528F', width: 1 }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // In pptxgenjs, we need to use coordinates instead of object references
    const connector = this.currentSlide.addShape('line', {
      x: fromElement.options.x + fromElement.options.w,
      y: fromElement.options.y + (fromElement.options.h / 2),
      w: toElement.options.x - (fromElement.options.x + fromElement.options.w),
      h: toElement.options.y - fromElement.options.y,
      line: mergedOptions.line,
      flipH: toElement.options.x < fromElement.options.x,
      lineHead: mergedOptions.type === 'arrow' ? 'arrow' : 'none'
    });
    
    const id = `connector_${fromId}_${toId}`;
    this.flowchartElements.set(id, { type: 'connector', object: connector, options: mergedOptions });
    
    this.history.push({ action: 'addConnector', fromId, toId, options: mergedOptions });
    return connector;
  }

  /**
   * Create a flowchart from Mermaid code
   * @param {string} mermaidCode - The Mermaid flowchart code
   * @param {Object} emojiMap - Map of node IDs to emojis
   * @returns {Object} - The created flowchart elements
   */
  createFlowchartFromMermaid(mermaidCode, emojiMap = {}) {
    if (!this.currentSlide) {
      this.createSlide('Flowchart');
    }
    
    const { type, nodes, connections } = parseMermaidFlowchart(mermaidCode);
    
    // Determine layout based on flowchart type
    const isHorizontal = type === 'LR' || type === 'RL';
    
    // Calculate positions
    const nodeIds = Object.keys(nodes);
    const nodeCount = nodeIds.length;
    
    // Clear existing elements
    this.flowchartElements.clear();
    
    // Add nodes as shapes
    let startX = 1;
    let startY = 2;
    const spacing = 2.5;
    
    nodeIds.forEach((nodeId, index) => {
      const node = nodes[nodeId];
      const emoji = emojiMap[nodeId] || '';
      const displayText = emoji ? `${emoji} ${node.label}` : node.label;
      
      let x, y;
      if (isHorizontal) {
        x = startX + (index * spacing);
        y = startY;
      } else {
        x = startX + (index % 3) * spacing;
        y = startY + Math.floor(index / 3) * 1.5;
      }
      
      this.addShape('rectangle', displayText, {
        id: nodeId,
        x,
        y,
        w: 2,
        h: 1,
        fill: { color: '4472C4' },
        line: { color: '2E528F', width: 1 },
        fontSize: 12,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        text: displayText // Explicitly set the text property
      });
    });
    
    // Add connections - only add connections if both source and target nodes exist
    connections.forEach(conn => {
      if (this.flowchartElements.has(conn.source) && this.flowchartElements.has(conn.target)) {
        this.addConnector(conn.source, conn.target, {
          type: conn.type.includes('>') ? 'arrow' : 'line'
        });
      } else {
        console.warn(`Skipping connection from ${conn.source} to ${conn.target} - one or both nodes don't exist`);
      }
    });
    
    this.history.push({ action: 'createFlowchartFromMermaid', mermaidCode, emojiMap });
    return { nodes, connections };
  }

  /**
   * Get a visual representation of the current slide
   * @returns {Object} - Description of the current slide
   */
  getVisualRepresentation() {
    if (!this.currentSlide) {
      return { elements: [] };
    }
    
    const elements = [];
    
    for (const [id, element] of this.flowchartElements.entries()) {
      elements.push({
        id,
        type: element.type,
        text: element.text || '', // Use our stored text property
        position: {
          x: element.options.x,
          y: element.options.y,
          width: element.options.w,
          height: element.options.h
        }
      });
    }
    
    return { elements };
  }

  /**
   * Generate the PowerPoint file as a buffer
   * @returns {Promise<Buffer>} - The PowerPoint file as a buffer
   */
  async generateBuffer() {
    return await this.pptx.writeFile({ outputType: 'nodebuffer' });
  }
}