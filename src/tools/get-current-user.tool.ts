import type { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import type { MyApiRestClient } from '../api/my-api-rest.client.js';
import { ApiRequestError } from '../errors/api-request.error.js';

export function registerGetCurrentUserTool(server: McpServer, apiClient: MyApiRestClient): void {
  server.registerTool('get_current_user', {
    title: 'Get current user',
    description: 'Read the safe profile of the user represented by this local access token.',
    inputSchema: z.object({}),
  }, async () => {
    try {
      const user = await apiClient.getCurrentUser();
      return { content: [{ type: 'text', text: JSON.stringify(user, null, 2) }] };
    } catch (error) {
      const message = error instanceof ApiRequestError
        ? `myAPIRest returned ${error.code}: ${error.message}`
        : 'Unable to connect to local myAPIRest.';
      return { isError: true, content: [{ type: 'text', text: message }] };
    }
  });
}
