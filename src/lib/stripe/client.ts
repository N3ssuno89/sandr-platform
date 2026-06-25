import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { env } from '@/lib/env';

// Stripe.js lato client, caricato una sola volta (Checkout/Elements).
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(env.stripe.publishableKey());
  }
  return stripePromise;
}
