# HomeInns - Next.js AI Agent 项目

## 项目概述

这是一个基于 Next.js 14+ App Router 的 AI Agent 聊天应用项目，集成了大语言模型(LLM)功能，提供智能对话和工具调用能力。

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI集成**: 支持多种LLM API (OpenAI, Anthropic等)
- **开发工具**: ESLint, Prettier

## 项目结构

```
homeinns/
├── app/                          # Next.js App Router 目录
│   ├── api/                      # API 路由
│   │   └── agent/route.ts       # 核心API：处理用户请求并调用LLM
│   ├── page.tsx                 # 前端聊天页面 (主页面)
│   ├── layout.tsx               # 根布局组件
│   └── globals.css              # 全局样式文件
├── lib/                         # 工具库和业务逻辑
│   └── agent.ts                 # Agent逻辑封装 (工具调用、上下文处理等)
├── components/                  # React 组件 (可选)
├── types/                       # TypeScript 类型定义 (可选)
├── package.json                 # 项目依赖配置
├── next.config.js              # Next.js 配置文件
├── .env.local                   # 环境变量 (存放LLM API密钥)
├── tsconfig.json               # TypeScript 配置
├── tailwind.config.js          # Tailwind CSS 配置
└── .eslintrc.json              # ESLint 配置
```

## 核心功能

### 1. AI Agent API (`app/api/agent/route.ts`)
- 处理前端发送的聊天请求
- 集成LLM API调用
- 支持工具调用和上下文管理
- 返回结构化的AI响应

### 2. 前端聊天界面 (`app/page.tsx`)
- 现代化的聊天UI界面
- 实时消息显示
- 用户输入处理
- 响应式设计

### 3. Agent逻辑封装 (`lib/agent.ts`)
- 核心业务逻辑抽象
- 工具调用管理
- 上下文状态处理
- 错误处理和重试机制

## 环境配置

### 必需的环境变量 (.env.local)
```env
# LLM API 配置
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# 其他配置
NEXT_PUBLIC_APP_NAME=HomeInns
```
