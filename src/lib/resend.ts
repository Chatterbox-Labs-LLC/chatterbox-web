import { Resend } from 'resend';

// Initialize lazily to avoid build-time errors if API key is missing
let resendInstance: Resend | null = null;

export const getResend = () => {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || 'dummy_key');
  }
  return resendInstance;
};

export const resend = getResend();

export const RESEND_FROM_EMAIL = 'onboarding@chatterboxteams.com';
