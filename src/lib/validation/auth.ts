import { z } from 'zod';

// Password validation - minimum security requirements
const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
  );

// Email validation with strict pattern
const emailSchema = z
  .string()
  .email('Format d\'email invalide')
  .max(254, 'L\'email ne peut pas dépasser 254 caractères')
  .transform(email => email.toLowerCase().trim());

// Registration DTO
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  email: emailSchema,
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^[+]?[0-9\s\-\(\)\.]{8,20}$/, 'Format de téléphone invalide'),
  address: z.object({
    street: z
      .string()
      .min(1, 'L\'adresse est requise')
      .max(100, 'L\'adresse ne peut pas dépasser 100 caractères')
      .trim(),
    city: z
      .string()
      .min(1, 'La ville est requise')
      .max(50, 'La ville ne peut pas dépasser 50 caractères')
      .trim(),
    postalCode: z
      .string()
      .min(1, 'Le code postal est requis')
      .max(10, 'Le code postal ne peut pas dépasser 10 caractères')
      .trim(),
    country: z
      .string()
      .min(1, 'Le pays est requis')
      .max(50, 'Le pays ne peut pas dépasser 50 caractères')
      .trim()
  }),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  }
);

// Login DTO
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis')
});

// Forgot password DTO
export const forgotPasswordSchema = z.object({
  email: emailSchema
});

// Reset password DTO
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  }
);

// Email verification DTO
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token requis')
});

// Export types
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;