// Triage Routes

import { Router } from 'express';
import { analyzeSymptoms } from '../controllers/triageController';

const router = Router();

/**
 * @route   POST /api/v1/triage
 * @desc    Perform triage analysis on patient symptoms
 * @access  Public
 * @body    {
 *            symptoms: Array<{
 *              symptomName: string,
 *              severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL',
 *              duration?: string,
 *              notes?: string
 *            }>,
 *            ageGroup?: string,
 *            existingConditions?: string[],
 *            medications?: string[],
 *            sessionId?: string
 *          }
 */
router.post('/', analyzeSymptoms);

export default router;