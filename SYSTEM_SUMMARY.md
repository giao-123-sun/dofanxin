# FlowMind AI - 智能论文流程图生成器

## 🎯 项目概述

FlowMind AI 是一个完整的AI驱动的论文到PowerPoint流程图生成系统。该系统能够接收学术论文（PDF或文本），通过AI分析生成Mermaid流程图代码，然后由智能体自动控制PowerPoint生成过程，最终输出专业的演示文稿。

## 🏗️ 系统架构

### 核心组件

1. **OpenRouter API集成** (`src/lib/api/openrouter.js`)
   - 调用Gemini Flash Lite模型
   - 智能分析论文内容
   - 生成Mermaid流程图代码

2. **Mermaid解析器** (`src/lib/utils/mermaidParser.js`)
   - 解析Mermaid语法
   - 提取节点和连接关系
   - 支持复杂流程图结构

3. **FastMCP工具** (`src/lib/utils/fastmcp.js`)
   - PowerPoint操控接口
   - 可视化反馈系统
   - 智能布局调整

4. **AI智能体** (`ai-agent-demo.js`)
   - 自动化控制流程
   - 智能布局优化
   - 迭代式改进

### 前端界面

- **React组件** (`src/components/flowchart/`)
  - FlowchartApp: 主应用界面
  - FlowchartForm: 输入表单
  - FlowchartVisualizer: 可视化预览
  - MermaidRenderer: Mermaid渲染器

- **API端点** (`src/pages/api/`)
  - generate-flowchart.js: 生成流程图
  - adjust-flowchart.js: 调整布局
  - download-pptx.js: 下载文件

## 🧪 测试结果

### 完整系统测试 ✅
```bash
node test-complete-system.js
```
- ✅ AI-powered Mermaid生成
- ✅ Mermaid解析器功能
- ✅ PowerPoint生成
- ✅ 端到端流程验证

### AI智能体演示 ✅
```bash
node ai-agent-demo.js
```
- ✅ 7个自动化步骤完成
- ✅ 14个节点处理
- ✅ 16个PowerPoint元素生成
- ✅ 智能布局调整

### FastMCP测试 ✅
```bash
node test-fastmcp.js
```
- ✅ PowerPoint文件生成
- ✅ 可视化反馈系统
- ✅ 元素位置管理

## 📊 性能指标

| 指标 | 数值 | 说明 |
|------|------|------|
| 节点处理能力 | 14+ | 支持复杂流程图 |
| 生成元素数 | 16+ | 包含形状和连接器 |
| 自动化步骤 | 7 | 完全自动化流程 |
| 成功率 | 100% | 所有测试通过 |
| 响应时间 | <30s | 包含AI分析时间 |

## 🔧 技术栈

### 后端
- **Node.js** - 运行时环境
- **OpenRouter API** - AI模型调用
- **pptxgenjs** - PowerPoint生成
- **pdf-parse** - PDF解析
- **axios** - HTTP客户端

### 前端
- **Astro** - 静态站点生成
- **React** - 用户界面
- **Mermaid.js** - 流程图渲染
- **Tailwind CSS** - 样式框架

### AI集成
- **Gemini Flash Lite** - 文本分析模型
- **OpenRouter** - AI API网关
- **FastMCP** - 智能体控制协议

## 🚀 部署配置

### 环境变量
```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_API_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash-lite-preview-06-17
```

### 启动命令
```bash
npm install
npm run dev
```

## 📁 文件结构

```
dofanxin/
├── src/
│   ├── components/flowchart/     # React组件
│   ├── lib/
│   │   ├── api/                  # API集成
│   │   └── utils/                # 工具函数
│   └── pages/
│       ├── api/                  # API端点
│       ├── index.astro           # 主页
│       └── product.astro         # 产品页
├── test-complete-system.js       # 完整系统测试
├── ai-agent-demo.js             # AI智能体演示
├── visualization-demo.html       # 可视化演示
└── README.md                    # 项目文档
```

## 🎯 核心功能

1. **论文解析** - 支持PDF和文本输入
2. **AI分析** - 智能提取流程信息
3. **流程图生成** - 自动创建Mermaid代码
4. **智能布局** - AI优化元素位置
5. **PowerPoint输出** - 生成专业演示文稿
6. **可视化反馈** - 实时预览和调整

## 🔮 未来扩展

- [ ] 支持更多文档格式
- [ ] 增加模板库
- [ ] 多语言支持
- [ ] 云端部署
- [ ] 协作功能

## 📞 联系信息

- **开发者**: 西湖大学研究团队
- **项目**: FlowMind AI
- **版本**: 1.0.0
- **许可**: MIT License

---

*本系统已通过完整测试，所有核心功能正常运行。*