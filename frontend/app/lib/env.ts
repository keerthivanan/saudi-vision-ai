/**
 * Environment variable configuration and validation
 */

export interface EnvConfig {
  nextauth: {
    secret: string;
    url: string;
    debug: boolean;
  };
  backend: {
    url: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
  };
  database: {
    url: string;
  };
}

function getRequiredEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
}

function getBooleanEnvVar(name: string, defaultValue: boolean = false): boolean {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

// Validate and parse environment variables
export function validateEnv(): EnvConfig {
  const config: EnvConfig = {
    nextauth: {
      secret: getRequiredEnvVar('NEXTAUTH_SECRET'),
      url: getRequiredEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
      debug: getBooleanEnvVar('NEXTAUTH_DEBUG', false),
    },
    backend: {
      // Align with Docker Compose and client usage
      url: getRequiredEnvVar('NEXT_PUBLIC_BACKEND_URL', 'http://backend:8000'),
    },
    google: {
      clientId: getRequiredEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: getRequiredEnvVar('GOOGLE_CLIENT_SECRET'),
    },
    database: {
      url: getOptionalEnvVar('DATABASE_URL'),
    },
  };

  return config;
}

// Get validated environment config
export const env = validateEnv();

// Environment validation for client-side usage
export function getClientEnv() {
  return {
    NEXTAUTH_URL: env.nextauth.url,
    NEXTAUTH_DEBUG: env.nextauth.debug,
  };
}

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development';

// Check if we're in production mode
export const isProduction = process.env.NODE_ENV === 'production';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    signin: '/auth/signin',
    signup: '/auth/signup',
    callback: '/api/auth/callback/google',
  },
  api: {
    query: `${env.backend.url}/api/v1/chat/stream`, // Updated to V1
    upload: `${env.backend.url}/api/v1/documents/`, // Updated to V1
    health: `${env.backend.url}/`,
    storeUser: '/api/store-user',
    conversations: `${env.backend.url}/api/v1/chat/history`, // Updated to V1
  },
} as const;

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateMessage(message: string): { isValid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (message.length > 10000) {
    return { isValid: false, error: 'Message is too long (maximum 10,000 characters)' };
  }

  // Basic XSS prevention check
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(message)) {
      return { isValid: false, error: 'Message contains potentially harmful content' };
    }
  }

  return { isValid: true };
}

export function sanitizeInput(input: string): string {
  // Remove potentially harmful scripts
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
