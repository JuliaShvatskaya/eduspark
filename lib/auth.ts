import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  age?: number;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  role: 'child' | 'parent' | 'teacher';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  age?: number;
  role: 'child' | 'parent' | 'teacher';
}

export interface SignInData {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Username validation
export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters long');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 12);
};

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword);
};

// Generate JWT tokens
export const generateTokens = (user: User): AuthTokens => {
  const accessToken = sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '15m' }
  );
  
  const refreshToken = sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Verify JWT token
export const verifyToken = (token: string, isRefreshToken = false): any => {
  try {
    const secret = isRefreshToken 
      ? process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
      : process.env.JWT_SECRET || 'fallback-secret';
    
    return verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Generate email verification token
export const generateEmailVerificationToken = (email: string): string => {
  return sign(
    { email, type: 'email-verification' },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );
};

// Generate password reset token
export const generatePasswordResetToken = (email: string): string => {
  return sign(
    { email, type: 'password-reset' },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '1h' }
  );
};

// Set secure cookies
export const setAuthCookies = (cookieStore: ReadonlyRequestCookies, tokens: AuthTokens, rememberMe = false) => {
  const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 1 day
  
  cookieStore.set('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
    path: '/'
  });
  
  cookieStore.set('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/'
  });
};

// Clear auth cookies
export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set('accessToken', '', {
    path: '/',
    maxAge: 0,
  });
  response.cookies.set('refreshToken', '', {
    path: '/',
    maxAge: 0,
  });
};

// Rate limiting for failed attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export const checkRateLimit = (identifier: string): { allowed: boolean; remainingTime?: number } => {
  const now = new Date();
  const attempts = failedAttempts.get(identifier);
  
  if (!attempts) {
    return { allowed: true };
  }
  
  // Reset after 15 minutes
  if (now.getTime() - attempts.lastAttempt.getTime() > 15 * 60 * 1000) {
    failedAttempts.delete(identifier);
    return { allowed: true };
  }
  
  // Allow up to 5 attempts
  if (attempts.count >= 5) {
    const remainingTime = 15 * 60 * 1000 - (now.getTime() - attempts.lastAttempt.getTime());
    return { allowed: false, remainingTime };
  }
  
  return { allowed: true };
};

export const recordFailedAttempt = (identifier: string) => {
  const now = new Date();
  const attempts = failedAttempts.get(identifier);
  
  if (attempts) {
    attempts.count += 1;
    attempts.lastAttempt = now;
  } else {
    failedAttempts.set(identifier, { count: 1, lastAttempt: now });
  }
};

export const clearFailedAttempts = (identifier: string) => {
  failedAttempts.delete(identifier);
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return sign(
    { type: 'csrf', timestamp: Date.now() },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '1h' }
  );
};

export const validateCSRFToken = (token: string): boolean => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return decoded.type === 'csrf';
  } catch {
    return false;
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};