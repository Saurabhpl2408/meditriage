import { mcpClient, handleApiError } from './api';

let requestId = 1;

async function callTool<T>(toolName: string, args: any): Promise<T> {
  try {
    const response = await mcpClient.post('', {
      jsonrpc: '2.0',
      id: requestId++,
      method: 'tools/call',
      params: { name: toolName, arguments: args },
    });

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    return response.data.result;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export const mcpService = {
  async performTriage(symptoms: any[], ageGroup?: string): Promise<any> {
    return callTool('perform_triage', { symptoms, ageGroup });
  },

  async searchSymptoms(query: string): Promise<any> {
    return callTool('search_symptoms', { query, limit: 10 });
  },

  async checkRedFlags(symptoms: string[]): Promise<any> {
    return callTool('check_red_flags', { symptoms });
  },
};