// Database types based on Supabase schema

export interface Sport {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: string;
  name: string;
  code: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface League {
  id: string;
  sport_id: string;
  country_id: string;
  name: string;
  logo_url: string | null;
  season: number | null;
  created_at: string;
  updated_at: string;
}

export interface Competition {
  id: string;
  sport_id: string;
  name: string;
  logo_url: string | null;
  is_international: boolean;
  country_id: string | null;
  season: number | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  sport_id: string;
  country_id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type MatchStatus =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "cancelled";

export interface Match {
  id: string;
  sport_id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  external_api_id: string | null;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface MatchWithDetails extends Match {
  home_team: Team;
  away_team: Team;
  leagues?: League[];
  competitions?: Competition[];
  predictions: Prediction[];
}

export interface Prediction {
  id: string;
  expert_id: string;
  match_id: string;
  prediction_type: "score" | "winner" | "both";
  home_prediction: number | null;
  away_prediction: number | null;
  winner_prediction: "home" | "away" | "draw" | null;
  odds: number | null;
  analysis: string | null;
  confidence_score: number;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  email_verified: boolean;
  is_expert: boolean;
  expert_approved: boolean;
  created_at: string;
  updated_at: string;
}
