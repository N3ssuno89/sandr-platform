export type ProfileView = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  createdAt: string;
};

export type WatchHistoryItem = {
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  watchedSeconds: number;
  durationSeconds: number | null;
  completed: boolean;
  lastWatchedAt: string;
};

export type ReminderItem = {
  id: string;
  title: string;
  remindAt: string | null;
};

// Schema kept for future FantaBeach integration — UI intentionally removed
export type FantasyTeamItem = {
  id: string;
  name: string | null;
  totalPoints: number;
  eventTitle: string | null;
};
