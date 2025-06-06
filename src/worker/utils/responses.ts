// Standardized API response utilities
import { Context } from 'hono';

export const successResponse = (c: Context, data: any, message: string = 'Success', statusCode: 200 | 201 = 200) => {
  return c.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }, statusCode);
};

export const errorResponse = (c: Context, error: string, details?: any, statusCode: 400 | 401 | 403 | 404 | 409 | 500 = 400) => {
  return c.json({
    success: false,
    error,
    details,
    timestamp: new Date().toISOString()
  }, statusCode);
};

export const validationErrorResponse = (c: Context, errors: string[]) => {
  return c.json({
    success: false,
    error: 'Validation failed',
    details: errors,
    timestamp: new Date().toISOString()
  }, 400);
};

export const notFoundResponse = (c: Context, resource: string) => {
  return c.json({
    success: false,
    error: `${resource} not found`,
    timestamp: new Date().toISOString()
  }, 404);
};

export const serverErrorResponse = (c: Context, message: string = 'Internal server error') => {
  return c.json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  }, 500);
}; 