// Tipi del database Supabase.
//
// NOTA: in produzione questo file va rigenerato con la CLI Supabase:
//   supabase gen types typescript --project-id <id> > src/types/database.ts
// Le definizioni qui sotto sono uno scheletro allineato alla migration
// supabase/migrations/0001_initial_schema.sql e vanno sostituite dall'output
// del generatore quando lo schema è applicato.

import type {
  AccessType,
  Circuit,
  MatchStatus,
  SubscriptionTier,
  UserRole,
} from './index';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          subscription_tier: SubscriptionTier;
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          subscription_tier?: SubscriptionTier;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      athletes: {
        Row: {
          id: string;
          name: string;
          photo_url: string | null;
          fivb_ranking: number | null;
          current_partner: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          photo_url?: string | null;
          fivb_ranking?: number | null;
          current_partner?: string | null;
        };
        Update: Partial<Database['public']['Tables']['athletes']['Insert']>;
      };
      tournaments: {
        Row: {
          id: string;
          name: string;
          circuit: Circuit;
          category: string | null;
          location: string | null;
          starts_at: string | null;
          ends_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          circuit: Circuit;
          category?: string | null;
          location?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['tournaments']['Insert']>;
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string | null;
          athlete1_id: string | null;
          athlete2_id: string | null;
          status: MatchStatus;
          stream_key: string | null;
          access_type: AccessType;
          scheduled_at: string | null;
        };
        Insert: {
          id?: string;
          tournament_id?: string | null;
          athlete1_id?: string | null;
          athlete2_id?: string | null;
          status?: MatchStatus;
          stream_key?: string | null;
          access_type?: AccessType;
          scheduled_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['matches']['Insert']>;
      };
      stats: {
        Row: {
          id: string;
          match_id: string;
          athlete_id: string;
          aces: number;
          blocks: number;
          errors: number;
          points: number;
        };
        Insert: {
          id?: string;
          match_id: string;
          athlete_id: string;
          aces?: number;
          blocks?: number;
          errors?: number;
          points?: number;
        };
        Update: Partial<Database['public']['Tables']['stats']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: SubscriptionTier;
          status: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: SubscriptionTier;
          status: string;
          expires_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
    };
    Views: { [key: string]: never };
    Functions: { [key: string]: never };
    Enums: {
      user_role: UserRole;
      access_type: AccessType;
      match_status: MatchStatus;
      subscription_tier: SubscriptionTier;
    };
  };
}
