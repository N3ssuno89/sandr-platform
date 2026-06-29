// Tipi del database Supabase — allineati a supabase/migrations/0001_complete_schema.sql.
//
// In produzione possono essere rigenerati con la CLI Supabase:
//   supabase gen types typescript --project-id <id> > src/types/database.ts
// Questo file è scritto a mano per riflettere fedelmente lo schema 0001
// (enum, tabelle con Row/Insert/Update e Relationships per gli embed PostgREST).

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
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: Database['public']['Enums']['user_role'];
          preferred_language: string;
          referred_by: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: Database['public']['Enums']['user_role'];
          preferred_language?: string;
          referred_by?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'profiles_referred_by_fkey';
            columns: ['referred_by'];
            isOneToOne: false;
            referencedRelation: 'broadcasters';
            referencedColumns: ['id'];
          },
        ];
      };
      sports: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon_url: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon_url?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database['public']['Tables']['sports']['Insert']>;
        Relationships: [];
      };
      federations: {
        Row: {
          id: string;
          name: string;
          short_name: string | null;
          slug: string;
          sport_id: string | null;
          nation: string | null;
          color: string | null;
          logo_url: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name?: string | null;
          slug: string;
          sport_id?: string | null;
          nation?: string | null;
          color?: string | null;
          logo_url?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['federations']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'federations_sport_id_fkey';
            columns: ['sport_id'];
            isOneToOne: false;
            referencedRelation: 'sports';
            referencedColumns: ['id'];
          },
        ];
      };
      broadcasters: {
        Row: {
          id: string;
          name: string;
          slug: string;
          profile_id: string | null;
          type: string;
          logo_url: string | null;
          description: string | null;
          bio: string | null;
          referral_enabled: boolean;
          referral_code: string | null;
          referral_percentage: number;
          referral_duration_months: number;
          content_revenue_share: number;
          ppv_revenue_share: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          profile_id?: string | null;
          type?: string;
          logo_url?: string | null;
          description?: string | null;
          bio?: string | null;
          referral_enabled?: boolean;
          referral_code?: string | null;
          referral_percentage?: number;
          referral_duration_months?: number;
          content_revenue_share?: number;
          ppv_revenue_share?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['broadcasters']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'broadcasters_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      broadcaster_federations: {
        Row: {
          broadcaster_id: string;
          federation_id: string;
        };
        Insert: {
          broadcaster_id: string;
          federation_id: string;
        };
        Update: Partial<Database['public']['Tables']['broadcaster_federations']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'broadcaster_federations_broadcaster_id_fkey';
            columns: ['broadcaster_id'];
            isOneToOne: false;
            referencedRelation: 'broadcasters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'broadcaster_federations_federation_id_fkey';
            columns: ['federation_id'];
            isOneToOne: false;
            referencedRelation: 'federations';
            referencedColumns: ['id'];
          },
        ];
      };
      athletes: {
        Row: {
          id: string;
          full_name: string;
          nation: string | null;
          nation_code: string | null;
          photo_url: string | null;
          sport_id: string | null;
          federation_id: string | null;
          profile_id: string | null;
          bio: string | null;
          ranking: number | null;
          season_points: number | null;
          is_featured: boolean;
          birth_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          nation?: string | null;
          nation_code?: string | null;
          photo_url?: string | null;
          sport_id?: string | null;
          federation_id?: string | null;
          profile_id?: string | null;
          bio?: string | null;
          ranking?: number | null;
          season_points?: number | null;
          is_featured?: boolean;
          birth_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['athletes']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'athletes_sport_id_fkey';
            columns: ['sport_id'];
            isOneToOne: false;
            referencedRelation: 'sports';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'athletes_federation_id_fkey';
            columns: ['federation_id'];
            isOneToOne: false;
            referencedRelation: 'federations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'athletes_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          federation_id: string | null;
          sport_id: string | null;
          organizer_broadcaster_id: string | null;
          location: string | null;
          nation: string | null;
          start_date: string | null;
          end_date: string | null;
          stage: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          federation_id?: string | null;
          sport_id?: string | null;
          organizer_broadcaster_id?: string | null;
          location?: string | null;
          nation?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          stage?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'events_federation_id_fkey';
            columns: ['federation_id'];
            isOneToOne: false;
            referencedRelation: 'federations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_sport_id_fkey';
            columns: ['sport_id'];
            isOneToOne: false;
            referencedRelation: 'sports';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_organizer_broadcaster_id_fkey';
            columns: ['organizer_broadcaster_id'];
            isOneToOne: false;
            referencedRelation: 'broadcasters';
            referencedColumns: ['id'];
          },
        ];
      };
      videos: {
        Row: {
          id: string;
          cloudflare_uid: string | null;
          title: string;
          description: string | null;
          type: Database['public']['Enums']['content_type'] | null;
          sport_id: string | null;
          federation_id: string | null;
          event_id: string | null;
          thumbnail_card_url: string | null;
          thumbnail_featured_url: string | null;
          duration_seconds: number | null;
          access_level: Database['public']['Enums']['access_level'];
          ppv_price: number | null;
          is_featured: boolean;
          is_live: boolean;
          live_started_at: string | null;
          published_at: string | null;
          status: Database['public']['Enums']['video_status'];
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cloudflare_uid?: string | null;
          title: string;
          description?: string | null;
          type?: Database['public']['Enums']['content_type'] | null;
          sport_id?: string | null;
          federation_id?: string | null;
          event_id?: string | null;
          thumbnail_card_url?: string | null;
          thumbnail_featured_url?: string | null;
          duration_seconds?: number | null;
          access_level?: Database['public']['Enums']['access_level'];
          ppv_price?: number | null;
          is_featured?: boolean;
          is_live?: boolean;
          live_started_at?: string | null;
          published_at?: string | null;
          status?: Database['public']['Enums']['video_status'];
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['videos']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'videos_sport_id_fkey';
            columns: ['sport_id'];
            isOneToOne: false;
            referencedRelation: 'sports';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'videos_federation_id_fkey';
            columns: ['federation_id'];
            isOneToOne: false;
            referencedRelation: 'federations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'videos_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
        ];
      };
      video_broadcasters: {
        Row: {
          video_id: string;
          broadcaster_id: string;
          is_primary: boolean;
        };
        Insert: {
          video_id: string;
          broadcaster_id: string;
          is_primary?: boolean;
        };
        Update: Partial<Database['public']['Tables']['video_broadcasters']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'video_broadcasters_video_id_fkey';
            columns: ['video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'video_broadcasters_broadcaster_id_fkey';
            columns: ['broadcaster_id'];
            isOneToOne: false;
            referencedRelation: 'broadcasters';
            referencedColumns: ['id'];
          },
        ];
      };
      video_athletes: {
        Row: {
          video_id: string;
          athlete_id: string;
        };
        Insert: {
          video_id: string;
          athlete_id: string;
        };
        Update: Partial<Database['public']['Tables']['video_athletes']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'video_athletes_video_id_fkey';
            columns: ['video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'video_athletes_athlete_id_fkey';
            columns: ['athlete_id'];
            isOneToOne: false;
            referencedRelation: 'athletes';
            referencedColumns: ['id'];
          },
        ];
      };
      video_tags: {
        Row: {
          id: string;
          video_id: string;
          tag: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          tag: string;
        };
        Update: Partial<Database['public']['Tables']['video_tags']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'video_tags_video_id_fkey';
            columns: ['video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
        ];
      };
      matches: {
        Row: {
          id: string;
          event_id: string | null;
          video_id: string | null;
          team_a_name: string | null;
          team_b_name: string | null;
          score_a: number;
          score_b: number;
          sets_a: number;
          sets_b: number;
          status: Database['public']['Enums']['match_status'];
          scorekeeper_token: string;
          scheduled_at: string | null;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          video_id?: string | null;
          team_a_name?: string | null;
          team_b_name?: string | null;
          score_a?: number;
          score_b?: number;
          sets_a?: number;
          sets_b?: number;
          status?: Database['public']['Enums']['match_status'];
          scorekeeper_token?: string;
          scheduled_at?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['matches']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'matches_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'matches_video_id_fkey';
            columns: ['video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
        ];
      };
      match_athletes: {
        Row: {
          match_id: string;
          athlete_id: string;
          team: string;
        };
        Insert: {
          match_id: string;
          athlete_id: string;
          team: string;
        };
        Update: Partial<Database['public']['Tables']['match_athletes']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'match_athletes_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'match_athletes_athlete_id_fkey';
            columns: ['athlete_id'];
            isOneToOne: false;
            referencedRelation: 'athletes';
            referencedColumns: ['id'];
          },
        ];
      };
      score_events: {
        Row: {
          id: string;
          match_id: string;
          team: string;
          athlete_id: string | null;
          type: Database['public']['Enums']['score_event_type'];
          set_number: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          team: string;
          athlete_id?: string | null;
          type: Database['public']['Enums']['score_event_type'];
          set_number?: number | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['score_events']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'score_events_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'score_events_athlete_id_fkey';
            columns: ['athlete_id'];
            isOneToOne: false;
            referencedRelation: 'athletes';
            referencedColumns: ['id'];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: Database['public']['Enums']['subscription_plan'];
          status: Database['public']['Enums']['subscription_status'];
          stripe_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          trial_ends_at: string | null;
          is_trial: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: Database['public']['Enums']['subscription_plan'];
          status: Database['public']['Enums']['subscription_status'];
          stripe_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          trial_ends_at?: string | null;
          is_trial?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      ppv_purchases: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          stripe_payment_id: string | null;
          amount: number | null;
          currency: string;
          valid_until: string | null;
          purchased_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          stripe_payment_id?: string | null;
          amount?: number | null;
          currency?: string;
          valid_until?: string | null;
          purchased_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ppv_purchases']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'ppv_purchases_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ppv_purchases_video_id_fkey';
            columns: ['video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
        ];
      };
      referrals: {
        Row: {
          id: string;
          user_id: string;
          broadcaster_id: string;
          subscription_id: string | null;
          commission_amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          broadcaster_id: string;
          subscription_id?: string | null;
          commission_amount?: number;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'referrals_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'referrals_broadcaster_id_fkey';
            columns: ['broadcaster_id'];
            isOneToOne: false;
            referencedRelation: 'broadcasters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'referrals_subscription_id_fkey';
            columns: ['subscription_id'];
            isOneToOne: false;
            referencedRelation: 'subscriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          video_id: string | null;
          match_id: string | null;
          remind_at: string | null;
          sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id?: string | null;
          match_id?: string | null;
          remind_at?: string | null;
          sent?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reminders']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'reminders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reminders_video_id_fkey';
            columns: ['video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reminders_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches';
            referencedColumns: ['id'];
          },
        ];
      };
      watch_history: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          watched_seconds: number;
          completed: boolean;
          last_watched_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          watched_seconds?: number;
          completed?: boolean;
          last_watched_at?: string;
        };
        Update: Partial<Database['public']['Tables']['watch_history']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'watch_history_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'watch_history_video_id_fkey';
            columns: ['video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
        ];
      };
      platform_settings: {
        Row: {
          key: string;
          value: Json | null;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json | null;
          description?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['platform_settings']['Insert']>;
        Relationships: [];
      };
      fantasy_teams: {
        Row: {
          id: string;
          user_id: string;
          event_id: string | null;
          name: string | null;
          total_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id?: string | null;
          name?: string | null;
          total_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['fantasy_teams']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'fantasy_teams_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fantasy_teams_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
        ];
      };
      fantasy_team_athletes: {
        Row: {
          fantasy_team_id: string;
          athlete_id: string;
        };
        Insert: {
          fantasy_team_id: string;
          athlete_id: string;
        };
        Update: Partial<Database['public']['Tables']['fantasy_team_athletes']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'fantasy_team_athletes_fantasy_team_id_fkey';
            columns: ['fantasy_team_id'];
            isOneToOne: false;
            referencedRelation: 'fantasy_teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fantasy_team_athletes_athlete_id_fkey';
            columns: ['athlete_id'];
            isOneToOne: false;
            referencedRelation: 'athletes';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      // RPC admin (migration 0002): estende un enum whitelisted (content_type).
      admin_add_enum_value: {
        Args: { enum_name: string; new_value: string };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: 'viewer' | 'broadcaster' | 'admin' | 'organizer';
      content_type: 'live' | 'replay' | 'interview' | 'highlights' | 'behind_scenes' | 'documentary';
      access_level: 'free' | 'premium' | 'ppv';
      video_status: 'processing' | 'ready' | 'draft' | 'archived';
      subscription_plan: 'free' | 'premium';
      subscription_status: 'active' | 'cancelled' | 'expired' | 'past_due';
      match_status: 'scheduled' | 'live' | 'completed' | 'cancelled';
      score_event_type: 'point' | 'ace' | 'error' | 'block' | 'timeout' | 'set_end' | 'match_end';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper di comodità (sottoinsieme di quelli generati da `supabase gen types`).
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
