// Input Sanitization Utilities

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Sanitize symptom name input
 */
export function sanitizeSymptomName(name: string): string {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s'-]/g, '') // Only allow letters, numbers, spaces, hyphens, apostrophes
    .substring(0, 255);
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(arr: string[]): string[] {
  if (!Array.isArray(arr)) return [];
  
  return arr
    .filter(item => typeof item === 'string')
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0)
    .slice(0, 100); // Limit array size
}

/**
 * Validate and sanitize session ID
 */
export function sanitizeSessionId(sessionId: string): string {
  if (!sessionId) return '';
  
  // Only allow alphanumeric and underscores
  return sessionId
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, 100);
}

/**
 * Remove potentially dangerous characters from SQL-like input
 */
export function sanitizeSqlLike(input: string): string {
  if (!input) return '';
  
  // Escape special SQL LIKE characters
  return input
    .replace(/[%_]/g, '\\$&')
    .substring(0, 255);
}