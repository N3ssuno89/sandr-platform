import Stripe from 'stripe';
import { env } from '@/lib/env';

// Client Stripe server-side (abbonamenti + PPV).
// AREA CRITICA: ogni modifica alla logica pagamenti richiede review umana (CLAUDE.md).
export const stripe = new Stripe(env.stripe.secretKey(), {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});
