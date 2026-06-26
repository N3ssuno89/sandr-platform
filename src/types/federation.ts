// Tipo federazione/circuito SANDR.
export interface Federation {
  id: string;
  name: string;
  shortName: string;
  nation: string;
  color: string; // brand color for card accent
  description: string;
  sport: string;
  contentCount: { live: number; replay: number; interviews: number; highlights: number };
}
