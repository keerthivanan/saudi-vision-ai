/**
 * Client-side environment validation
 */

interface ClientEnv {
  NEXTAUTH_URL: string;
  NEXTAUTH_DEBUG: boolean;
  NEXT_PUBLIC_BACKEND_URL: string;
  NEXT_PUBLIC_ENVIRONMENT: string;
  NEXT_PUBLIC_ENABLE_VOICE_INPUT: boolean;
  NEXT_PUBLIC_ENABLE_DARK_MODE: boolean;
  NEXT_PUBLIC_ENABLE_MULTILINGUAL: boolean;
  NEXT_PUBLIC_MAX_MESSAGE_LENGTH: number;
}

function getClientEnvVar(name: keyof ClientEnv, defaultValue?: any): any {
  const value = process.env[name];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable ${name} is not set`);
    return defaultValue;
  }
  return value || defaultValue;
}

export function validateClientEnv(): ClientEnv {
  return {
    NEXTAUTH_URL: getClientEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
    NEXTAUTH_DEBUG: getClientEnvVar('NEXTAUTH_DEBUG', 'false') === 'true',
    NEXT_PUBLIC_BACKEND_URL: getClientEnvVar('NEXT_PUBLIC_BACKEND_URL', 'http://localhost:8000'),
    NEXT_PUBLIC_ENVIRONMENT: getClientEnvVar('NEXT_PUBLIC_ENVIRONMENT', 'development'),
    NEXT_PUBLIC_ENABLE_VOICE_INPUT: getClientEnvVar('NEXT_PUBLIC_ENABLE_VOICE_INPUT', 'false') === 'true',
    NEXT_PUBLIC_ENABLE_DARK_MODE: getClientEnvVar('NEXT_PUBLIC_ENABLE_DARK_MODE', 'true') === 'true',
    NEXT_PUBLIC_ENABLE_MULTILINGUAL: getClientEnvVar('NEXT_PUBLIC_ENABLE_MULTILINGUAL', 'true') === 'true',
    NEXT_PUBLIC_MAX_MESSAGE_LENGTH: parseInt(getClientEnvVar('NEXT_PUBLIC_MAX_MESSAGE_LENGTH', '10000')),
  };
}

export const clientEnv = validateClientEnv();

// Environment checks
export const isProduction = clientEnv.NEXT_PUBLIC_ENVIRONMENT === 'production';
export const isDevelopment = clientEnv.NEXT_PUBLIC_ENVIRONMENT === 'development';
export const isStaging = clientEnv.NEXT_PUBLIC_ENVIRONMENT === 'staging';

// Feature flags
export const features = {
  voiceInput: clientEnv.NEXT_PUBLIC_ENABLE_VOICE_INPUT,
  darkMode: clientEnv.NEXT_PUBLIC_ENABLE_DARK_MODE,
  multilingual: clientEnv.NEXT_PUBLIC_ENABLE_MULTILINGUAL,
  maxMessageLength: clientEnv.NEXT_PUBLIC_MAX_MESSAGE_LENGTH,
};
