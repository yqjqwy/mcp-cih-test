# 🏙️ mcp-cih

[![npm version](https://img.shields.io/npm/v/mcp-cih.svg?logo=npm)](https://www.npmjs.com/package/mcp-cih)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-green.svg?logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://mcpservers.org)

> 🧩 A Model Context Protocol (MCP) server & CLI tool for querying **average house prices** by city name.  
> 支持 **中文与英文城市名** 查询房价均价（元/㎡），提供 **CLI 命令行工具** 与 **MCP stdio 模式**。

---

## ✨ 功能概述

| 功能项      | 说明                                                               |
| ----------- | ------------------------------------------------------------------ |
| 🌆 城市查询 | 输入城市名称，返回均价（元/㎡）                                    |
| 🧠 MCP 支持 | 可在支持 MCP 的客户端（如 ChatGPT MCP、ModelScope、MCP IDE）中调用 |
| 💻 CLI 工具 | 可直接在命令行中执行                                               |
| 📊 示例数据 | 默认使用本地 JSON 数据，支持接入真实 API                           |

---

## ⚙️ 环境要求

- Node.js ≥ **18**
- npm ≥ **8**（推荐使用 `pnpm`）
- 已安装依赖 `@modelcontextprotocol/sdk`

---

## 🚀 快速开始

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 构建项目

```bash
npm run build
```

### 3️⃣ CLI 模式示例

```bash
node dist/cli.js --city 北京
node dist/cli.js --city shanghai
node dist/cli.js --list
```

输出示例：

```json
{
  "city": "北京",
  "normalizedCity": "beijing",
  "average": 73218,
  "currency": "CNY",
  "unit": "元/㎡",
  "updatedAt": "2025-01-01T00:00:00Z",
  "source": "示例数据源",
  "confidence": 0.95
}
```

### 4️⃣ 启动 MCP Server

```bash
node dist/cli.js --stdio
```

此模式可被 ChatGPT、MCP IDE 等客户端直接识别与调用。

---

## 🧠 MCP 工具定义

| 属性     | 值                           |
| -------- | ---------------------------- |
| 工具名   | `get_city_avg_house_price`   |
| 输入参数 | `{ "city": string }`         |
| 输出     | 城市均价及元数据的 JSON 对象 |

示例请求：

```json
{
  "input": { "city": "上海" }
}
```

示例响应：

```json
{
  "city": "上海",
  "normalizedCity": "shanghai",
  "average": 68500,
  "currency": "CNY",
  "unit": "元/㎡",
  "updatedAt": "2025-01-01T00:00:00Z",
  "source": "示例数据源",
  "confidence": 0.92
}
```

---

## 🧩 MCP 配置文件（.mcp.json）

为便于 MCP 客户端识别和调用，请在项目根目录中添加 `.mcp.json` 文件：

```json
{
  "mcpServers": {
    "mcp-cih": {
      "command": "npx",
      "args": ["-y", "mcp-cih-test", "--stdio"]
    }
  }
}
```

---

## 📦 package.json 配置要求

```json
{
  "name": "mcp-cih-test",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/cli.js",
  "bin": { "mcp-cih": "dist/cli.js" },
  "mcp": { "entry": "dist/cli.js" },
  "scripts": {
    "build": "tsc",
    "start": "node dist/cli.js --stdio"
  }
}
```

---

## ☁️ 发布与上架

本项目支持多平台上架，文档位于 `publish/*/README.md`：

| 平台                        | 路径                           | 说明           |
| --------------------------- | ------------------------------ | -------------- |
| 📦 NPM                      | `publish/npm/README.md`        | 发布命令行工具 |
| 🌐 MCPServers.org           | `publish/mcpservers/README.md` | 提交 MCP 服务  |
| ☁️ 腾讯云开发               | `publish/tencent/README.md`    | 云端部署说明   |
| 🧠 ModelScope / 百炼 / 千帆 | `publish/modelscope/README.md` | AI 平台部署    |
| 🔍 百度开放平台             | `publish/baidu/README.md`      | 搜索能力集成   |

---

## 🧾 License

MIT © 2025 Your Name or Organization

---

## 💬 联系与支持

- 作者：[yqjqwy](https://github.com/yqjqwy/mcp-cih-test)
- 反馈：[GitHub Issues](https://github.com/yqjqwy/mcp-cih-test/issues)

---

## ✅ 提交描述（用于 MCP 上架）

**名称：** 城市房价均价查询  
**描述：** 输入城市名称（中文/英文），返回最新房价均价（元/㎡）。适用于智能助理、对话引擎、AI 数据接口等场景。  
**标签：** 房价、数据查询、城市信息、MCP、CLI、AI 工具
