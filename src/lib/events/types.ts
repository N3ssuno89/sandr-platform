export type EventRow = {
  id: string;
  title: string;
  slug: string | null;
  federation_id: string | null;
  sport_id: string | null;
  location: string | null;
  nation: string | null;
  start_date: string | null;
  end_date: string | null;
  stage: string | null;
};

export type EventInput = {
  title: string;
  federation_id?: string;
  sport_id?: string;
  location?: string;
  nation?: string;
  start_date?: string;
  end_date?: string;
  stage?: string;
};
