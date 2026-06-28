export type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'viewer' | 'broadcaster' | 'admin' | 'organizer';
  preferred_language: string;
  created_at: string;
};

export type LiveVideoRow = {
  id: string;
  title: string;
  isLive: boolean;
  status: string;
  date: string;
};

export type SubsOverview = {
  active: number;
  cancelled: number;
  total: number;
  recent: { id: string; plan: string; status: string; periodEnd: string | null; createdAt: string }[];
};
