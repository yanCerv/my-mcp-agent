import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { MyApiRestClient } from './api/my-api-rest.client.js';
import { loadConfig } from './config.js';
import { registerGetCurrentUserTool } from './tools/get-current-user.tool.js';

const config = loadConfig();
const server = new McpServer({ name: 'my-mcp-agent', version: '0.1.0' });
registerGetCurrentUserTool(server, new MyApiRestClient(config.apiBaseUrl, config.accessToken));
await server.connect(new StdioServerTransport());

// STDIO is reserved for JSON-RPC messages. Do not use console.log in this server.
console.error('my-mcp-agent is running on stdio.');
