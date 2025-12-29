// Symptom Controller - Handles symptom search and retrieval

import { Request, Response } from 'express';
import { query } from '../config/database';
import { Symptom } from '../types/triage.types';
import { QUERY_LIMITS } from '../config/constants';
import logger from '../utils/logger';

/**
 * GET /api/v1/symptoms/search
 * Search for symptoms by name or keywords
 */
export async function searchSymptoms(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const searchQuery = (req.query.q as string || '').trim();
    const bodySystem = req.query.bodySystem as string;
    const redFlagOnly = req.query.redFlagOnly === 'true';
    const limit = Math.min(
      parseInt(req.query.limit as string) || QUERY_LIMITS.DEFAULT_PAGE_SIZE,
      QUERY_LIMITS.MAX_SYMPTOMS_SEARCH
    );

    // Validate search query
    if (!searchQuery) {
      res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_QUERY',
          message: 'Search query parameter "q" is required'
        }
      });
      return;
    }

    if (searchQuery.length < 2) {
      res.status(400).json({
        success: false,
        error: {
          code: 'QUERY_TOO_SHORT',
          message: 'Search query must be at least 2 characters'
        }
      });
      return;
    }

    // Build SQL query
    let sql = `
      SELECT 
        id,
        name,
        description,
        common_names,
        body_system,
        default_severity,
        is_red_flag,
        keywords
      FROM symptoms
      WHERE (
        LOWER(name) LIKE LOWER($1)
        OR LOWER(description) LIKE LOWER($1)
        OR keywords && ARRAY[LOWER($2)]
        OR EXISTS (
          SELECT 1 FROM unnest(common_names) cn
          WHERE LOWER(cn) LIKE LOWER($1)
        )
      )
    `;

    const params: any[] = [`%${searchQuery}%`, searchQuery];
    let paramCount = 2;

    // Add body system filter
    if (bodySystem) {
      paramCount++;
      sql += ` AND body_system = $${paramCount}`;
      params.push(bodySystem);
    }

    // Add red flag filter
    if (redFlagOnly) {
      sql += ' AND is_red_flag = TRUE';
    }

    sql += ' ORDER BY is_red_flag DESC, name ASC';
    sql += ` LIMIT $${paramCount + 1}`;
    params.push(limit);

    // Execute query
    const result = await query(sql, params);

    const symptoms: Symptom[] = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      commonNames: row.common_names,
      bodySystem: row.body_system,
      defaultSeverity: row.default_severity,
      isRedFlag: row.is_red_flag,
      keywords: row.keywords,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.status(200).json({
      success: true,
      data: {
        symptoms,
        totalCount: symptoms.length,
        query: searchQuery
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Symptom search failed', { error });
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SEARCH_FAILED',
        message: 'Failed to search symptoms'
      }
    });
  }
}

/**
 * GET /api/v1/symptoms/:id
 * Get a specific symptom by ID
 */
export async function getSymptomById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM symptoms WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          code: 'SYMPTOM_NOT_FOUND',
          message: 'Symptom not found'
        }
      });
      return;
    }

    const row = result.rows[0];
    const symptom: Symptom = {
      id: row.id,
      name: row.name,
      description: row.description,
      commonNames: row.common_names,
      bodySystem: row.body_system,
      defaultSeverity: row.default_severity,
      isRedFlag: row.is_red_flag,
      keywords: row.keywords,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    res.status(200).json({
      success: true,
      data: symptom,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Get symptom by ID failed', { error });
    
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch symptom'
      }
    });
  }
}

/**
 * GET /api/v1/symptoms/body-systems
 * Get list of all body systems
 */
export async function getBodySystems(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await query(`
      SELECT DISTINCT body_system
      FROM symptoms
      WHERE body_system IS NOT NULL
      ORDER BY body_system
    `);

    const bodySystems = result.rows.map((row: any) => row.body_system);

    res.status(200).json({
      success: true,
      data: bodySystems,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Get body systems failed', { error });
    
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch body systems'
      }
    });
  }
}

/**
 * GET /api/v1/symptoms/red-flags
 * Get all red flag symptoms
 */
export async function getRedFlagSymptoms(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        description,
        common_names,
        body_system,
        default_severity,
        keywords
      FROM symptoms
      WHERE is_red_flag = TRUE
      ORDER BY name
    `);

    const symptoms: Symptom[] = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      commonNames: row.common_names,
      bodySystem: row.body_system,
      defaultSeverity: row.default_severity,
      isRedFlag: true,
      keywords: row.keywords,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.status(200).json({
      success: true,
      data: symptoms,
      meta: {
        timestamp: new Date().toISOString(),
        count: symptoms.length
      }
    });
  } catch (error) {
    logger.error('Get red flag symptoms failed', { error });
    
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch red flag symptoms'
      }
    });
  }
}