export type Sport = "AFL" | "NRL" | "UFC" | "RACING" | "TRIVIA" | "MUSIC" | "GENERAL";

export type VenueItemKind =
  | "competition"
  | "event"
  | "prize"
  | "music"
  | "trivia_pack";

export interface TriviaQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface VenueItem {
  id: string;
  venue_slug: string;
  kind: VenueItemKind;
  sort_order: number;
  is_active: boolean;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  sport?: Sport | null;
  starts_at?: string | null;
  ends_at?: string | null;
  prize?: string | null;
  image_url?: string | null;
  config: Record<string, unknown>;
}

export interface EntryPayload {
  venue_slug: string;
  item_id: string;
  name: string;
  email: string;
  mobile?: string;
  username?: string;
  answers: Record<string, unknown>;
  score?: number;
  consent: boolean;
}
