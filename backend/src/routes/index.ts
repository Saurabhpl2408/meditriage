// Main Routes Index

import { Router } from 'express';
import symptomRoutes from './symptomRoutes';
import triageRoutes from './triageRoutes';
import {
  getHealth,
  getDetailedHealth,
  getReadiness,
  getLiveness
} from '../controllers/healthController';

const router = Router();

// Health check routes (not versioned)
router.get('/health', getHealth);
router.get('/health/detailed', getDetailedHealth);
router.get('/health/ready', getReadiness);
router.get('/health/live', getLiveness);

// API v1 routes
router.use('/api/v1/symptoms', symptomRoutes);
router.use('/api/v1/triage', triageRoutes);

// Root endpoint
router.get('/', (_req, res) => {
  res.json({
    name: 'MediTriage API',
    version: '1.0.0',
    description: 'AI Medical Symptom Checker & Triage Assistant',
    endpoints: {
      health: '/health',
      symptoms: '/api/v1/symptoms',
      triage: '/api/v1/triage'
    },
    documentation: 'https://github.com/yourusername/meditriage'
  });
});

export default router;