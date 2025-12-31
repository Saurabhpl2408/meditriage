import { ragClient, handleApiError } from './api';

export const ragService = {
  async queryKnowledge(query: string, topK: number = 5): Promise<any> {
    try {
      const response = await ragClient.post('/query', {
        query,
        top_k: topK,
      });

      if (!response.data.success) {
        throw new Error('Knowledge query failed');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getCollectionInfo(): Promise<any> {
    try {
      const response = await ragClient.get('/collection/info');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};