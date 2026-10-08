import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    phone: z.string().min(10, 'Valid Pakistani phone number required (e.g. +923001234567)'),
    email: z.string().email('Valid email address required').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    isVendorApplication: z.boolean().optional().default(false),
    storeName: z.string().min(3).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    loginIdentifier: z.string().min(3, 'Phone or email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});
