// Triage Service - Backend API Integration

import { apiClient, ApiResponse, handleApiError } from './api';
import { Symptom, TriageResult, AgeGroup } from '@/types';

export interface TriageRequest {
  symptoms: Array<{
    symptomName: string;
    severity: string;
    duration?: string;
    notes?: string;
  }>;
  ageGroup?: AgeGroup;
  existingConditions?: string[];
  medications?: string[];
  sessionId?: string;
}

export const triageService = {
  /**
   * Perform triage analysis
   */
  async analyzeSymptoms(symptoms: Symptom[], ageGroup?: AgeGroup): Promise<TriageResult> {
    try {
      const request: TriageRequest = {
        symptoms: symptoms.map(s => ({
          symptomName: s.symptomName,
          severity: s.severity,
          duration: s.duration,
          notes: s.notes,
        })),
        ageGroup,
        sessionId: `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const response = await apiClient.post<ApiResponse<TriageResult>>('/triage', request);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Triage analysis failed');
      }

      return response.data.data;
    } catch (error) {
      console.error('[Triage] Analysis failed:', error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Search symptoms
   */
  async searchSymptoms(query: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/symptoms/search', {
        params: { q: query, limit },
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Search failed');
      }

      return response.data.data.symptoms || [];
    } catch (error) {
      console.error('[Triage] Symptom search failed:', error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get red flag symptoms
   */
  async getRedFlags(): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/symptoms/red-flags');

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch red flags');
      }

      return response.data.data;
    } catch (error) {
      console.error('[Triage] Red flags fetch failed:', error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get body systems
   */
  async getBodySystems(): Promise<string[]> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/symptoms/body-systems');

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch body systems');
      }

      return response.data.data;
    } catch (error) {
      console.error('[Triage] Body systems fetch failed:', error);
      throw new Error(handleApiError(error));
    }
  },
};