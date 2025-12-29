// Triage Controller - Handles triage API requests

import { Request, Response } from 'express';
import { performTriage, logTriageAssessment } from '../services/triageService';
import { TriageRequest } from '../types/triage.types';
import logger from '../utils/logger';

/**
 * POST /api/v1/triage
 * Perform triage analysis on patient symptoms
 */
export async function analyzeSymptoms(
  req: Request,
  res: Response
): Promise<void> {
  const startTime = Date.now();

  try {
    const triageRequest: TriageRequest = {
      symptoms: req.body.symptoms,
      ageGroup: req.body.ageGroup,
      existingConditions: req.body.existingConditions,
      medications: req.body.medications,
      sessionId: req.body.sessionId || generateSessionId()
    };

    // Validate request
    const validationError = validateTriageRequest(triageRequest);
    if (validationError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError
        }
      });
      return;
    }

    // Perform triage analysis
    const result = await performTriage(triageRequest);

    const responseTime = Date.now() - startTime;

    // Log the assessment (async, don't wait)
    logTriageAssessment(triageRequest, result, responseTime).catch(err =>
      logger.error('Failed to log triage', { error: err })
    );

    // Return result
    res.status(200).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        sessionId: triageRequest.sessionId
      }
    });
  } catch (error) {
    logger.error('Triage analysis endpoint failed', { error });
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to analyze symptoms. Please try again.'
      }
    });
  }
}

/**
 * Validate triage request
 */
function validateTriageRequest(request: TriageRequest): string | null {
  // Check symptoms array exists and is not empty
  if (!request.symptoms || !Array.isArray(request.symptoms)) {
    return 'Symptoms array is required';
  }

  if (request.symptoms.length === 0) {
    return 'At least one symptom is required';
  }

  if (request.symptoms.length > 20) {
    return 'Maximum 20 symptoms allowed';
  }

  // Validate each symptom
  for (let i = 0; i < request.symptoms.length; i++) {
    const symptom = request.symptoms[i];

    if (!symptom.symptomName || typeof symptom.symptomName !== 'string') {
      return `Symptom ${i + 1}: symptomName is required and must be a string`;
    }

    if (symptom.symptomName.trim().length === 0) {
      return `Symptom ${i + 1}: symptomName cannot be empty`;
    }

    if (symptom.symptomName.length > 255) {
      return `Symptom ${i + 1}: symptomName is too long (max 255 characters)`;
    }

    if (!symptom.severity) {
      return `Symptom ${i + 1}: severity is required`;
    }

    const validSeverities = ['MILD', 'MODERATE', 'SEVERE', 'CRITICAL'];
    if (!validSeverities.includes(symptom.severity)) {
      return `Symptom ${i + 1}: severity must be one of: ${validSeverities.join(', ')}`;
    }

    // Optional fields validation
    if (symptom.duration && typeof symptom.duration !== 'string') {
      return `Symptom ${i + 1}: duration must be a string`;
    }

    if (symptom.notes && typeof symptom.notes !== 'string') {
      return `Symptom ${i + 1}: notes must be a string`;
    }
  }

  // Validate age group if provided
  if (request.ageGroup) {
    const validAgeGroups = ['infant', 'toddler', 'child', 'adolescent', 'adult', 'elderly'];
    if (!validAgeGroups.includes(request.ageGroup)) {
      return `ageGroup must be one of: ${validAgeGroups.join(', ')}`;
    }
  }

  // Validate existing conditions if provided
  if (request.existingConditions && !Array.isArray(request.existingConditions)) {
    return 'existingConditions must be an array';
  }

  // Validate medications if provided
  if (request.medications && !Array.isArray(request.medications)) {
    return 'medications must be an array';
  }

  return null; // Valid
}

/**
 * Generate a session ID for tracking
 */
function generateSessionId(): string {
  return `triage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}