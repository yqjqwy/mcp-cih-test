# mcp-cih

根据城市查询房价均价的 MCP 服务器与 CLI 工具。

- 功能：输入城市名称，返回示例数据中的房价均价（单位：元/平方米）。
- 形态：
  - CLI：`mcp-cih --city <城市名>` 输出 JSON 结果。
  - MCP stdio：`node dist/cli.js --stdio`（需安装 `@modelcontextprotocol/sdk`），用于在支持 MCP 的客户端中调用。

## 快速开始

1. 安装依赖（本地环境需要 Node.js 18+）：

```bash
npm i
```

2. 构建：

```bash
npm run build
```

3. CLI 查询示例：

```bash
node dist/cli.js --city 北京
node dist/cli.js --city shanghai
node dist/cli.js --list
```

4. 以 MCP stdio 模式启动（用于被 MCP 客户端消费）：

```bash
node dist/cli.js --stdio
```

> 注意：`@modelcontextprotocol/sdk` 的具体 API 可能随版本变化，示例代码中对 SDK 的调用做了兼容性处理，若启动失败请按发布文档中的说明检查依赖版本。

## 数据源说明

- 默认使用 `data/city_prices.json` 提供的示例数据（不代表真实市场行情）。
- 若需接入真实数据源，建议：
  - 在 `src/tools/housePrice.ts` 中替换 `loadDataset()` 实现，改为调用内网数据接口或公共 API（并做好缓存与重试）。
  - 保持返回结构一致：`{ city, normalizedCity, average, currency, unit, updatedAt, source, confidence }`。

## MCP 工具规范

- 工具名：`get_city_avg_house_price`
- 输入：`{ city: string }`（支持中文或英文别名，如 "北京"/"beijing"）
- 输出：包含均价与元数据的 JSON 结构，详见上文。

## 发布与上架

本仓库配套了各平台上架文档，位于 `publish/*/README.md`：

- NPM
- MCP.so
- MCPServers.org
- 腾讯云开发
- ModelScope
- 阿里云百炼
- 百度智能云千帆
- 百度搜索开放平台

按需参考对应说明进行打包、校验与上架。