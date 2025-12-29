import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

// Database configuration
const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'meditriage',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'dev_password',
  
  // Connection pool settings
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  max: parseInt(process.env.DB_POOL_MAX || '10'),
  
  // Timeouts
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  
  // SSL configuration for production (AWS RDS)
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
};

// Create connection pool
const pool = new Pool(poolConfig);

// Handle pool errors
pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  logger.info('Database connection established');
});

pool.on('remove', () => {
  logger.info('Database connection removed from pool');
});

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    logger.info('Database connection test successful', { time: result.rows[0].now });
    return true;
  } catch (error) {
    logger.error('Database connection test failed', error);
    return false;
  }
}

/**
 * Execute a query with parameters
 */
export async function query(text: string, params?: any[]): Promise<any> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug('Executed query', {
      text,
      duration,
      rows: result.rowCount
    });
    
    return result;
  } catch (error) {
    logger.error('Query execution failed', {
      text,
      error
    });
    throw error;
  }
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get a client from the pool for complex operations
 */
export async function getClient() {
  return await pool.connect();
}

/**
 * Close all database connections
 */
export async function closePool(): Promise<void> {
  await pool.end();
  logger.info('Database pool closed');
}

/**
 * Health check query
 */
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy';
  latency: number;
  poolStatus: {
    total: number;
    idle: number;
    waiting: number;
  };
}> {
  const start = Date.now();
  
  try {
    await pool.query('SELECT 1');
    const latency = Date.now() - start;
    
    return {
      status: 'healthy',
      latency,
      poolStatus: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: Date.now() - start,
      poolStatus: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  }
}

export default pool;