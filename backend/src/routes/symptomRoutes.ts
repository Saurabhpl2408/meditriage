// Symptom Routes

import { Router } from 'express';
import {
  searchSymptoms,
  getSymptomById,
  getBodySystems,
  getRedFlagSymptoms
} from '../controllers/symptomController';

const router = Router();

/**
 * @route   GET /api/v1/symptoms/search
 * @desc    Search for symptoms by name or keywords
 * @access  Public
 * @query   q - search query (required)
 * @query   bodySystem - filter by body system (optional)
 * @query   redFlagOnly - only show red flags (optional)
 * @query   limit - max results (optional, default 10)
 */
router.get('/search', searchSymptoms);

/**
 * @route   GET /api/v1/symptoms/body-systems
 * @desc    Get list of all body systems
 * @access  Public
 */
router.get('/body-systems', getBodySystems);

/**
 * @route   GET /api/v1/symptoms/red-flags
 * @desc    Get all red flag symptoms
 * @access  Public
 */
router.get('/red-flags', getRedFlagSymptoms);

/**
 * @route   GET /api/v1/symptoms/:id
 * @desc    Get a specific symptom by ID
 * @access  Public
 */
router.get('/:id', getSymptomById);

export default router;