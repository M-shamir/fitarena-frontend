import { z } from 'zod';

export const trainerSignUpSchema = z.object({
  username: z
  .string()
  .min(1, 'Username is required')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email is invalid'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender' }),
  trainer_type: z
    .array(z.number())
    .min(1, 'Please select at least one trainer type'),
  languages_spoken: z
    .array(z.number())
    .min(1, 'Please select at least one language'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export type TrainerSignUpSchemaType = z.infer<typeof trainerSignUpSchema>;
