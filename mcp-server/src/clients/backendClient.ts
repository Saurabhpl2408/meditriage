// Backend API Client

import axios, { AxiosInstance, AxiosError } from 'axios';
import logger from '../utils/logger';

class BackendClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.BACKEND_API_URL || 'http://localhost:3000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: parseInt(process.env.BACKEND_API_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MediTriage-MCP-Server/1.0'
      }
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('Backend API request', {
          method: config.method,
          url: config.url,
          params: config.params
        });
        return config;
      },
      (error) => {
        logger.error('Backend API request error', { error });
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('Backend API response', {
          status: response.status,
          url: response.config.url
        });
        return response;
      },
      (error: AxiosError) => {
        logger.error('Backend API response error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Search for symptoms
   */
  async searchSymptoms(params: {
    query: string;
    limit?: number;
    bodySystem?: string;
    redFlagOnly?: boolean;
  }) {
    const response = await this.client.get('/api/v1/symptoms/search', {
      params
    });
    return response.data;
  }

  /**
   * Get symptom by ID
   */
  async getSymptom(id: string) {
    const response = await this.client.get(`/api/v1/symptoms/${id}`);
    return response.data;
  }

  /**
   * Get red flag symptoms
   */
  async getRedFlags() {
    const response = await this.client.get('/api/v1/symptoms/red-flags');
    return response.data;
  }

  /**
   * Get body systems
   */
  async getBodySystems() {
    const response = await this.client.get('/api/v1/symptoms/body-systems');
    return response.data;
  }

  /**
   * Perform triage analysis
   */
  async performTriage(data: {
    symptoms: Array<{
      symptomName: string;
      severity: string;
      duration?: string;
      notes?: string;
    }>;
    ageGroup?: string;
    existingConditions?: string[];
    medications?: string[];
    sessionId?: string;
  }) {
    const response = await this.client.post('/api/v1/triage', data);
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Singleton instance
export default new BackendClient();