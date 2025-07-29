// OpenRouter API Configuration
export const OPENROUTER_CONFIG = {
  API_URL: 'https://openrouter.ai/api/v1',
  MODEL: 'google/gemini-2.5-flash-lite-preview-06-17',
  // API_KEY should be set in environment variables, not in code
  // Use process.env.OPENROUTER_API_KEY in production
};

// Prompt templates for flowchart generation
export const FLOWCHART_PROMPTS = {
  GENERATE_MERMAID: `
You are an expert in creating flowcharts from academic papers and text. 
Your task is to analyze the provided text and generate a Mermaid flowchart that represents the key processes, methods, or workflows described in the text.

Guidelines:
1. Focus on identifying sequential steps, processes, or methodologies
2. Use clear, concise labels for each node
3. Ensure the flowchart accurately represents the relationships between steps
4. Use appropriate flowchart symbols (process, decision, etc.)
5. Keep the flowchart clean and readable

Please output:
1. A Mermaid flowchart code using the flowchart TD (top-down) syntax
2. A brief summary explaining the flowchart (2-3 sentences)

Text to analyze:
{text}
`,

  GENERATE_EMOJI_SUGGESTIONS: `
For the following Mermaid flowchart nodes, suggest appropriate emojis that visually represent each node's concept.
Return the result as a JSON object with node IDs as keys and emoji suggestions as values.

Mermaid flowchart:
{mermaidCode}

Example output format:
{
  "A": "📊",
  "B": "🧹",
  "C": "🔍"
}
`
};

// Mock data for testing without API access
export const MOCK_DATA = {
  mermaidFlowchart: `flowchart TD
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
  }
};