/**
 * Frontend input validation and sanitization utilities
 */

import { features } from '../../lib/env-validation';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true, sanitizedValue: email.toLowerCase().trim() };
}

// Message validation
export function validateMessage(message: string): ValidationResult {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length > features.maxMessageLength) {
    return {
      isValid: false,
      error: `Message is too long (maximum ${features.maxMessageLength} characters)`
    };
  }

  if (trimmedMessage.length < 1) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  // XSS prevention - check for dangerous patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
    /onclick=/gi,
    /onmouseover=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmedMessage)) {
      return { isValid: false, error: 'Message contains potentially harmful content' };
    }
  }

  // Check for excessive repeated characters (potential spam)
  const repeatedChars = /(.)\1{10,}/;
  if (repeatedChars.test(trimmedMessage)) {
    return { isValid: false, error: 'Message contains too many repeated characters' };
  }

  return { isValid: true, sanitizedValue: trimmedMessage };
}

// File upload validation
export function validateFile(file: File): ValidationResult {
  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File is too large (maximum 50MB)' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'File is empty' };
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/markdown',
    'application/rtf',
    'text/csv',
    'application/json'
  ];

  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md', '.rtf', '.csv', '.json'];

  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);

  if (!isValidType) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload PDF, DOCX, TXT, MD, RTF, CSV, or JSON files.'
    };
  }

  // Check filename for dangerous characters
  const dangerousFilenameChars = /[<>:"|?*\x00-\x1f]/;
  if (dangerousFilenameChars.test(file.name)) {
    return { isValid: false, error: 'Filename contains invalid characters' };
  }

  // Check filename length
  if (file.name.length > 255) {
    return { isValid: false, error: 'Filename is too long' };
  }

  return { isValid: true, sanitizedValue: file.name };
}

// Conversation title validation
export function validateConversationTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { isValid: true, sanitizedValue: 'New Chat' }; // Default title
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length > 100) {
    return { isValid: false, error: 'Title is too long (maximum 100 characters)' };
  }

  // Basic sanitization - remove potentially harmful characters
  const sanitizedTitle = trimmedTitle.replace(/[<>"'&]/g, '');

  return { isValid: true, sanitizedValue: sanitizedTitle };
}

// Rate limiting helper (client-side)
class RateLimiter {
  private requests: number[] = [];
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getRemainingTime(): number {
    if (this.requests.length === 0) return 0;

    const now = Date.now();
    const oldestRequest = Math.min(...this.requests);
    const timeUntilReset = this.windowMs - (now - oldestRequest);

    return Math.max(0, timeUntilReset);
  }
}

// Global rate limiter for API requests
export const apiRateLimiter = new RateLimiter(60000, 20); // 20 requests per minute

// Input sanitization helpers
export function sanitizeHtml(text: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

export function sanitizeFilename(filename: string): string {
  // Remove path traversal and dangerous characters
  return filename
    .replace(/[/\\:*?"<>|]/g, '_')
    .replace(/\x00-\x1f/g, '')
    .substring(0, 255); // Limit length
}

// Content moderation (basic)
export function checkContentModeration(text: string): { isAllowed: boolean; reason?: string } {
  // Basic profanity check (expand as needed)
  const prohibitedWords = [
    'spam', 'scam', 'phishing', 'malware', 'virus', 'hack',
    // Add more words as needed
  ];

  const lowerText = text.toLowerCase();

  for (const word of prohibitedWords) {
    if (lowerText.includes(word)) {
      return { isAllowed: false, reason: 'Content contains prohibited terms' };
    }
  }

  // Check for excessive caps
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.8 && text.length > 10) {
    return { isAllowed: false, reason: 'Too many capital letters' };
  }

  return { isAllowed: true };
}
