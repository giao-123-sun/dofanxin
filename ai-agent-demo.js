#!/usr/bin/env node

/**
 * AI Agent Demo for FlowMind AI
 * Demonstrates an AI agent controlling the PowerPoint generation process
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { FastMCP } from './src/lib/utils/fastmcp.js';
import { parseMermaidFlowchart } from './src/lib/utils/mermaidParser.js';
import fs from 'fs';

console.log('🤖 FlowMind AI - AI Agent Demo\n');
console.log('Simulating an AI agent controlling PowerPoint generation...\n');

// Sample Mermaid flowchart for machine learning research paper
const researchPaperMermaid = `flowchart TD
    A[📊 Literature Review] --> B[🎯 Problem Definition]
    B --> C[📋 Data Collection]
    C --> D[🔧 Data Preprocessing]
    D --> E[🔍 Feature Engineering]
    E --> F[🧠 Model Selection]
    F --> G[⚙️ Hyperparameter Tuning]
    G --> H[🏋️ Model Training]
    H --> I[📈 Model Evaluation]
    I --> J{🤔 Performance OK?}
    J -->|No| K[🔄 Iterate Design]
    K --> F
    J -->|Yes| L[📝 Results Analysis]
    L --> M[📊 Visualization]
    M --> N[📄 Paper Writing]
    N --> O[🚀 Publication]`;

class AIAgent {
  constructor() {
    this.fastMCP = new FastMCP();
    this.currentStep = 0;
    this.steps = [
      'Initialize PowerPoint presentation',
      'Create title slide',
      'Parse Mermaid flowchart',
      'Generate flowchart on slide',
      'Get visual representation',
      'Analyze and adjust layout',
      'Finalize presentation'
    ];
  }

  log(message) {
    console.log(`🤖 AI Agent: ${message}`);
  }

  async executeStep(stepName, action) {
    this.currentStep++;
    console.log(`\n📋 Step ${this.currentStep}: ${stepName}`);
    this.log(`Executing: ${stepName}`);
    
    try {
      const result = await action();
      this.log(`✅ Completed: ${stepName}`);
      return result;
    } catch (error) {
      this.log(`❌ Failed: ${stepName} - ${error.message}`);
      throw error;
    }
  }

  async run() {
    try {
      // Step 1: Initialize
      await this.executeStep('Initialize PowerPoint presentation', async () => {
        this.log('Creating new PowerPoint presentation...');
        return 'Initialized';
      });

      // Step 2: Create title slide
      await this.executeStep('Create title slide', async () => {
        this.fastMCP.createSlide('AI-Generated Research Flowchart');
        this.log('Title slide created with heading');
        return 'Title slide created';
      });

      // Step 3: Parse Mermaid
      const parsedData = await this.executeStep('Parse Mermaid flowchart', async () => {
        this.log('Analyzing Mermaid syntax...');
        const parsed = parseMermaidFlowchart(researchPaperMermaid);
        this.log(`Found ${Object.keys(parsed.nodes).length} nodes and ${parsed.connections.length} connections`);
        return parsed;
      });

      // Step 4: Generate flowchart
      await this.executeStep('Generate flowchart on slide', async () => {
        this.log('Creating flowchart elements...');
        this.fastMCP.createFlowchartFromMermaid(researchPaperMermaid);
        this.log('Flowchart elements added to slide');
        return 'Flowchart generated';
      });

      // Step 5: Get visual representation
      const visualRep = await this.executeStep('Get visual representation', async () => {
        this.log('Analyzing current slide layout...');
        const visual = this.fastMCP.getVisualRepresentation();
        this.log(`Current slide has ${visual.elements.length} elements`);
        return visual;
      });

      // Step 6: Analyze and adjust
      await this.executeStep('Analyze and adjust layout', async () => {
        this.log('Analyzing layout for improvements...');
        
        // Simulate AI analysis
        const elements = visualRep.elements;
        let adjustments = 0;
        
        elements.forEach(element => {
          if (element.type === 'shape') {
            // Simulate intelligent adjustments
            if (element.position.x < 1) {
              this.log(`Adjusting element ${element.id} - moving right for better visibility`);
              adjustments++;
            }
            if (element.position.y > 6) {
              this.log(`Adjusting element ${element.id} - moving up to fit slide`);
              adjustments++;
            }
          }
        });
        
        this.log(`Made ${adjustments} intelligent layout adjustments`);
        return `${adjustments} adjustments made`;
      });

      // Step 7: Finalize
      const outputPath = await this.executeStep('Finalize presentation', async () => {
        this.log('Generating final PowerPoint file...');
        const buffer = await this.fastMCP.generateBuffer();
        const filename = 'ai-agent-demo-flowchart.pptx';
        fs.writeFileSync(filename, buffer);
        this.log(`PowerPoint saved as ${filename}`);
        return filename;
      });

      // Generate summary report
      const report = {
        timestamp: new Date().toISOString(),
        agent: 'FlowMind AI Agent',
        task: 'Research Paper Flowchart Generation',
        input: {
          type: 'Mermaid Flowchart',
          nodes: Object.keys(parsedData.nodes).length,
          connections: parsedData.connections.length
        },
        output: {
          file: outputPath,
          elements: visualRep.elements.length,
          slides: 1
        },
        steps_completed: this.currentStep,
        status: 'SUCCESS'
      };

      fs.writeFileSync('ai-agent-demo-report.json', JSON.stringify(report, null, 2));

      console.log('\n🎉 AI Agent Demo Completed Successfully!');
      console.log('📊 Summary:');
      console.log(`   • Processed ${Object.keys(parsedData.nodes).length} flowchart nodes`);
      console.log(`   • Created ${parsedData.connections.length} connections`);
      console.log(`   • Generated ${visualRep.elements.length} PowerPoint elements`);
      console.log(`   • Completed ${this.currentStep} automated steps`);
      console.log(`   • Output file: ${outputPath}`);
      console.log(`   • Report saved: ai-agent-demo-report.json`);

      return true;

    } catch (error) {
      console.error('\n❌ AI Agent Demo Failed:', error.message);
      
      const errorReport = {
        timestamp: new Date().toISOString(),
        agent: 'FlowMind AI Agent',
        error: error.message,
        steps_completed: this.currentStep,
        status: 'FAILED'
      };
      
      fs.writeFileSync('ai-agent-demo-report.json', JSON.stringify(errorReport, null, 2));
      return false;
    }
  }
}

// Run the AI agent demo
console.log('🚀 Starting AI Agent Demo...');
const agent = new AIAgent();
agent.run().then(success => {
  console.log(success ? '\n✅ Demo completed successfully!' : '\n❌ Demo failed!');
  process.exit(success ? 0 : 1);
});