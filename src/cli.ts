#!/usr/bin/env node
import { getAveragePrice, listSupportedCities } from './tools/housePrice.js';
import { Server  } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
function printUsage() {
  console.log(`\n用法：\n  mcp-cih --city <城市名>          查询该城市的房价均价\n  mcp-cih --list                   列出支持的城市\n  mcp-cih --stdio                  以 MCP stdio 模式启动（需安装 @modelcontextprotocol/sdk）\n\n示例：\n  mcp-cih --city 北京\n  mcp-cih --city shanghai\n`);
}

async function startMcpServer() {
  try {
    // @ts-ignore
    // 下面的 API 可能因版本而异，示例性写法：
    const server = new Server({
      name: 'mcp-cih',
      version: '0.1.0'
    });

    // 声明工具能力，避免 setRequestHandler 能力校验失败
    server.registerCapabilities({ tools: {} });

    // 使用 setRequestHandler 注册工具列表处理器
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_city_avg_house_price',
            description: '根据城市名称返回房价均价',
            inputSchema: {
              type: 'object',
              properties: {
                city: { type: 'string', description: '城市中文或英文名' }
              },
              required: ['city']
            },
            // 定义输出结构，便于以 structuredContent 返回
            outputSchema: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                normalizedCity: { type: 'string' },
                average: { type: 'number' },
                currency: { type: 'string' },
                unit: { type: 'string' },
                updatedAt: { type: 'string' },
                source: { type: 'string' },
                confidence: { type: 'number' },
                message: { type: 'string' }
              },
              required: ['city', 'normalizedCity', 'average', 'currency', 'unit', 'updatedAt', 'source', 'confidence']
            }
          }
        ]
      };
    });

    // 使用 setRequestHandler 注册工具调用处理器
    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params ?? { name: undefined, arguments: {} };

      try {
        switch (name) {
          case 'get_city_avg_house_price': {
            const res = getAveragePrice(String(args?.city ?? ''));
            // 返回结构化结果（符合上面 outputSchema），并附带文本摘要
            return {
              structuredContent: res,
              content: [{
                type: 'text',
                text: `${res.city}(${res.normalizedCity}) 均价: ${Number.isFinite(res.average) ? res.average : '未知'} ${res.unit} (${res.currency})`
              }]
            };
          }
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `未知的工具: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `工具执行错误: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('mcp-cih MCP 服务器已通过 stdio 启动。');
  } catch (err: any) {
    console.error('启动 MCP 服务器失败，请确认已安装并正确配置 @modelcontextprotocol/sdk。');
    console.error(err?.message || err);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }

  if (args.includes('--stdio')) {
    await startMcpServer();
    return;
  }

  if (args.includes('--list')) {
    const cities = listSupportedCities();
    console.log(cities.join('\n'));
    return;
  }

  const cityFlagIndex = args.indexOf('--city');
  if (cityFlagIndex !== -1 && args[cityFlagIndex + 1]) {
    const city = args[cityFlagIndex + 1];
    const result = getAveragePrice(city);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printUsage();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});