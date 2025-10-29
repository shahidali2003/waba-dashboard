import { z } from 'zod';

export const sendMessageSchema = z.object({
  to: z
    .string()
    .trim()
    .regex(/^\+\d{8,15}$/, {
      message: 'Phone number must start with + followed by 8-15 digits (e.g., +917644939132)',
    }),
  message: z
    .string()
    .trim()
    .min(1, { message: 'Message cannot be empty' })
    .max(1000, { message: 'Message must be less than 1000 characters' }),
});

export const webhookSchema = z.object({
  From: z
    .string()
    .trim()
    .regex(/^whatsapp:\+\d{8,15}$/, {
      message: 'Must be in format: whatsapp:+<countrycode><number>',
    }),
  To: z
    .string()
    .trim()
    .regex(/^whatsapp:\+\d{8,15}$/, {
      message: 'Must be in format: whatsapp:+<countrycode><number>',
    }),
  Body: z
    .string()
    .trim()
    .min(1, { message: 'Message body cannot be empty' })
    .max(1000, { message: 'Message body must be less than 1000 characters' }),
});

export type SendMessageFormData = {
  to: string;
  message: string;
};

export type WebhookFormData = {
  From: string;
  To: string;
  Body: string;
};
