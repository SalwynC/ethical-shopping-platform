import { z } from 'zod';

export const urlSchema = z.object({
  url: z
    .string()
    .trim()
    .url('Please provide a valid URL')
    .refine((value) => value.startsWith('https://'), {
      message: 'Only HTTPS URLs are supported for security reasons',
    }),
});

export const consentSchema = z.object({
  email: z.string().email().optional(),
  consent: z.boolean(),
});
