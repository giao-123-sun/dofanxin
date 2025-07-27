/**
 * Parse Mermaid flowchart code to extract nodes and connections
 * @param {string} mermaidCode - The Mermaid flowchart code
 * @returns {Object} - Object containing nodes and connections
 */
export function parseMermaidFlowchart(mermaidCode) {
  const nodes = {};
  const connections = [];
  
  // Split the code into lines
  const lines = mermaidCode.split('\n');
  
  // Extract the flowchart type (TD, LR, etc.)
  let flowchartType = '';
  const typeMatch = lines[0].match(/flowchart\s+(TD|LR|RL|BT)/i);
  if (typeMatch) {
    flowchartType = typeMatch[1];
  }
  
  // Process each line
  for (const line of lines) {
    // Skip the flowchart declaration line and empty lines
    if (line.trim().startsWith('flowchart') || line.trim() === '') {
      continue;
    }
    
    // Check if the line defines a node
    const nodeMatch = line.match(/\s*([A-Za-z0-9_-]+)\s*\[(["']?)([^[\]]+)\2\]/);
    if (nodeMatch) {
      const [, id, , label] = nodeMatch;
      nodes[id] = { id, label: label.trim(), type: 'default' };
      continue;
    }
    
    // Check if the line defines a connection
    // This regex matches connections like A --> B, A -- text --> B, etc.
    const connectionMatch = line.match(/\s*([A-Za-z0-9_-]+)\s*(?:--(?:[^-]+)?->|-->|==>|-.+->|=.+=>) *([A-Za-z0-9_-]+)/);
    if (connectionMatch) {
      const [, source, target] = connectionMatch;
      connections.push({ source, target, type: '-->' });
      
      // Make sure both nodes exist (they might be implicitly defined by the connection)
      if (!nodes[source]) {
        nodes[source] = { id: source, label: source, type: 'default' };
      }
      if (!nodes[target]) {
        nodes[target] = { id: target, label: target, type: 'default' };
      }
      continue;
    }
    
    // Alternative connection pattern: A --> B
    const simpleConnectionMatch = line.match(/\s*([A-Za-z0-9_-]+)\s*-->\s*([A-Za-z0-9_-]+)/);
    if (simpleConnectionMatch) {
      const [, source, target] = simpleConnectionMatch;
      connections.push({ source, target, type: '-->' });
      
      // Make sure both nodes exist
      if (!nodes[source]) {
        nodes[source] = { id: source, label: source, type: 'default' };
      }
      if (!nodes[target]) {
        nodes[target] = { id: target, label: target, type: 'default' };
      }
      continue;
    }
    
    // Check for subgraph definitions (simplified)
    const subgraphMatch = line.match(/\s*subgraph\s+([A-Za-z0-9_-]+)/);
    if (subgraphMatch) {
      // We could process subgraphs here if needed
      continue;
    }
  }
  
  return { 
    type: flowchartType, 
    nodes, 
    connections 
  };
}

/**
 * Apply emoji suggestions to Mermaid code
 * @param {string} mermaidCode - The original Mermaid code
 * @param {Object} emojiMap - Map of node IDs to emojis
 * @returns {string} - Updated Mermaid code with emojis
 */
export function applyEmojisToMermaid(mermaidCode, emojiMap) {
  if (!emojiMap || Object.keys(emojiMap).length === 0) {
    return mermaidCode;
  }
  
  let updatedCode = mermaidCode;
  
  // For each node ID in the emoji map
  for (const [nodeId, emoji] of Object.entries(emojiMap)) {
    // Find the node definition in the Mermaid code
    const nodeRegex = new RegExp(`(\\s*${nodeId}\\s*\\[)(["\']?)([^\\[\\]]+)\\2(\\])`, 'g');
    
    // Replace the node label with the label + emoji
    updatedCode = updatedCode.replace(nodeRegex, (match, prefix, quote, label, suffix) => {
      return `${prefix}${quote}${emoji} ${label}${quote}${suffix}`;
    });
  }
  
  return updatedCode;
}