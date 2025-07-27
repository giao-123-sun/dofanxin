import axios from 'axios';

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'google/gemini-2.5-flash-lite-preview-06-17';

/**
 * Generate a Mermaid flowchart from paper text
 * @param {string} paperText - The text content from the paper
 * @returns {Promise<{mermaid: string, summary: string}>} - The generated Mermaid code and summary
 */
export async function generateMermaidFromPaper(paperText) {
  try {
    const prompt = `
You are an expert at creating flowcharts from academic papers. 
Given the following paper text, create a Mermaid flowchart that represents the main process, methodology, or framework described in the paper.

Paper Text:
${paperText.substring(0, 10000)} ${paperText.length > 10000 ? '... (truncated)' : ''}

Please provide:
1. A Mermaid flowchart code that represents the main process or methodology in the paper.
2. A brief summary (2-3 sentences) of what the flowchart represents.

For the Mermaid flowchart:
- Use flowchart TD (top-down) or LR (left-right) syntax
- Include clear node labels
- Use appropriate connections between nodes
- Keep it focused on the main process/methodology
- Use subgraphs if needed to group related steps
- Add appropriate styling to make it visually clear

Return your response in the following JSON format:
{
  "mermaid": "flowchart TD\\n  A[Start] --> B[Process]\\n  ...",
  "summary": "Brief explanation of what this flowchart represents..."
}
`;

    const response = await axios.post(
      `${OPENROUTER_API_URL}/chat/completions`,
      {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You are a helpful assistant that creates Mermaid flowcharts from academic papers." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://example.com'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    return {
      mermaid: parsedContent.mermaid,
      summary: parsedContent.summary
    };
  } catch (error) {
    console.error('Error generating Mermaid from paper:', error);
    throw new Error('Failed to generate flowchart from paper');
  }
}

/**
 * Generate emoji suggestions for flowchart nodes
 * @param {string} mermaidCode - The Mermaid flowchart code
 * @returns {Promise<Object>} - Object mapping node IDs to suggested emojis
 */
export async function generateEmojiSuggestions(mermaidCode) {
  try {
    const prompt = `
Given the following Mermaid flowchart code, suggest appropriate emojis for each node that would help visualize the concept.

Mermaid Code:
\`\`\`
${mermaidCode}
\`\`\`

For each node in the flowchart, suggest a relevant emoji that represents the concept.
Return your response as a JSON object where the keys are the node IDs and the values are the suggested emojis.

Example format:
{
  "A": "🚀",
  "B": "📊",
  "Process1": "⚙️"
}
`;

    const response = await axios.post(
      `${OPENROUTER_API_URL}/chat/completions`,
      {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You are a helpful assistant that suggests appropriate emojis for flowchart nodes." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://example.com'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating emoji suggestions:', error);
    throw new Error('Failed to generate emoji suggestions');
  }
}