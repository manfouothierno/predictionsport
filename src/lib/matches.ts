import { supabase } from "@/lib/supabase";
import {
  MatchWithDetails,
  Match,
  Team,
  League,
  Competition,
  Sport,
} from "@/types/database";
import { getLeagueIdFromName, LEAGUE_NAME_MAPPING } from "@/lib/leagues";

export type DateFilter = "all" | "today" | "tomorrow";

/**
 * Get all sports from the database
 * @returns Array of sports
 */
export async function getAllSports(): Promise<Sport[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  try {
    const { data: sports, error } = await supabase
      .from("sports")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching sports:", error);
      return [];
    }

    return sports || [];
  } catch (error) {
    console.error("Error in getAllSports:", error);
    return [];
  }
}

/**
 * Fetch upcoming matches from Supabase (only scheduled and live)
 * @param limit - Number of matches to fetch (default: 12)
 * @param sport - Filter by sport name (optional)
 * @returns Array of matches with team and league details
 */
export async function getUpcomingMatches(
  limit: number = 12,
  sport: string = "Football",
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  try {
    // First, get the sport ID
    const { data: sportData, error: sportError } = await supabase
      .from("sports")
      .select("id")
      .eq("name", sport)
      .single();

    if (sportError) {
      console.error("Error fetching sport:", sportError);
      return [];
    }

    // Fetch upcoming matches with team details (only scheduled and live)
    const { data: matches, error: matchError } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(*)
      `,
      )
      .eq("sport_id", sportData.id)
      .in("status", ["scheduled", "live"])
      .gte("match_date", new Date().toISOString())
      .order("match_date", { ascending: true })
      .limit(limit);

    if (matchError) {
      console.error("Error fetching matches:", matchError);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        // Fetch leagues
        const { data: leagueData } = await supabase
          .from("match_leagues")
          .select("league_id, leagues(*)")
          .eq("match_id", match.id);

        // Fetch competitions
        const { data: competitionData } = await supabase
          .from("match_competitions")
          .select("competition_id, competitions(*)")
          .eq("match_id", match.id);

        const leagues =
          leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || [];
        const competitions =
          competitionData?.map((mc: any) => mc.competitions).filter(Boolean) ||
          [];

        return {
          ...match,
          leagues,
          competitions,
        };
      }),
    );

    return matchesWithDetails;
  } catch (error) {
    console.error("Error in getUpcomingMatches:", error);
    return [];
  }
}

/**
 * Fetch a single match by ID with all details
 */
export async function getMatchById(
  matchId: string,
): Promise<MatchWithDetails | null> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return null;
  }

  try {
    const { data: match, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(*)
      `,
      )
      .eq("id", matchId)
      .single();

    if (error) {
      console.error("Error fetching match:", error);
      return null;
    }

    // Fetch leagues and competitions
    const { data: leagueData } = await supabase
      .from("match_leagues")
      .select("league_id, leagues(*)")
      .eq("match_id", match.id);

    const { data: competitionData } = await supabase
      .from("match_competitions")
      .select("competition_id, competitions(*)")
      .eq("match_id", match.id);

    const leagues =
      leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || [];
    const competitions =
      competitionData?.map((mc: any) => mc.competitions).filter(Boolean) || [];

    return {
      ...match,
      leagues,
      competitions,
    };
  } catch (error) {
    console.error("Error in getMatchById:", error);
    return null;
  }
}

/**
 * Get matches by date range (only scheduled and live)
 */
export async function getMatchesByDateRange(
  startDate: Date,
  endDate: Date,
  limit: number = 50,
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  try {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(*)
      `,
      )
      .gte("match_date", startDate.toISOString())
      .lte("match_date", endDate.toISOString())
      .in("status", ["scheduled", "live"])
      .order("match_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching matches by date range:", error);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        // Fetch leagues
        const { data: leagueData } = await supabase
          .from("match_leagues")
          .select("league_id, leagues(*)")
          .eq("match_id", match.id);

        // Fetch competitions
        const { data: competitionData } = await supabase
          .from("match_competitions")
          .select("competition_id, competitions(*)")
          .eq("match_id", match.id);

        const leagues =
          leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || [];
        const competitions =
          competitionData?.map((mc: any) => mc.competitions).filter(Boolean) ||
          [];

        return {
          ...match,
          leagues,
          competitions,
        };
      }),
    );

    return matchesWithDetails;
  } catch (error) {
    console.error("Error in getMatchesByDateRange:", error);
    return [];
  }
}

/**
 * Get tomorrow's matches (only scheduled and live)
 */
export async function getTomorrowMatches(
  limit: number = 100,
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
  dayAfterTomorrow.setHours(23, 59, 59, 999);

  try {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(*)
      `,
      )
      .gte("match_date", tomorrow.toISOString())
      .lte("match_date", dayAfterTomorrow.toISOString())
      .in("status", ["scheduled", "live"])
      .order("match_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching tomorrow matches:", error);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        const { data: leagueData } = await supabase
          .from("match_leagues")
          .select("league_id, leagues(*)")
          .eq("match_id", match.id);

        const { data: competitionData } = await supabase
          .from("match_competitions")
          .select("competition_id, competitions(*)")
          .eq("match_id", match.id);

        const leagues =
          leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || [];
        const competitions =
          competitionData?.map((mc: any) => mc.competitions).filter(Boolean) ||
          [];

        return {
          ...match,
          leagues,
          competitions,
        };
      }),
    );

    return matchesWithDetails;
  } catch (error) {
    console.error("Error in getTomorrowMatches:", error);
    return [];
  }
}

/**
 * Get today's matches (only scheduled and live)
 */
export async function getTodayMatches(
  limit: number = 100,
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(*, expert:users!predictions_expert_id_fkey(*))
      `,
      )
      .gte("match_date", today.toISOString())
      .lte("match_date", endOfToday.toISOString())
      .in("status", ["scheduled", "live"])
      .order("match_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching today matches:", error);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        const { data: leagueData } = await supabase
          .from("match_leagues")
          .select("league_id, leagues(*)")
          .eq("match_id", match.id);

        const { data: competitionData } = await supabase
          .from("match_competitions")
          .select("competition_id, competitions(*)")
          .eq("match_id", match.id);

        const leagues =
          leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || [];
        const competitions =
          competitionData?.map((mc: any) => mc.competitions).filter(Boolean) ||
          [];

        return {
          ...match,
          leagues,
          competitions,
        };
      }),
    );

    return matchesWithDetails;
  } catch (error) {
    console.error("Error in getTodayMatches:", error);
    return [];
  }
}

/**
 * Get live matches (status = 'live')
 */
export async function getLiveMatches(
  limit: number = 100,
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  try {
    // Fetch live matches with team details
    const { data: matches, error: matchError } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(*, expert:users!predictions_expert_id_fkey(*))
      `,
      )
      .eq("status", "live")
      .order("match_date", { ascending: true })
      .limit(limit);

    if (matchError) {
      console.error("Error fetching live matches:", matchError);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        // Fetch leagues
        const { data: leagueData } = await supabase
          .from("match_leagues")
          .select("league_id, leagues(*)")
          .eq("match_id", match.id);

        // Fetch competitions
        const { data: competitionData } = await supabase
          .from("match_competitions")
          .select("competition_id, competitions(*)")
          .eq("match_id", match.id);

        const leagues =
          leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || [];
        const competitions =
          competitionData?.map((mc: any) => mc.competitions).filter(Boolean) ||
          [];

        return {
          ...match,
          leagues,
          competitions,
        };
      }),
    );

    return matchesWithDetails;
  } catch (error) {
    console.error("Error in getLiveMatches:", error);
    return [];
  }
}

/**
 * Get all matches for today (only live and scheduled)
 */
export async function getAllTodayMatches(
  limit: number = 100,
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(*, expert:users!predictions_expert_id_fkey(*))
      `,
      )
      .gte("match_date", today.toISOString())
      .lte("match_date", endOfToday.toISOString())
      .in("status", ["live", "scheduled"])
      .order("match_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching all today matches:", error);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        const { data: leagueData } = await supabase
          .from("match_leagues")
          .select("league_id, leagues(*)")
          .eq("match_id", match.id);

        const { data: competitionData } = await supabase
          .from("match_competitions")
          .select("competition_id, competitions(*)")
          .eq("match_id", match.id);

        const leagues =
          leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || [];
        const competitions =
          competitionData?.map((mc: any) => mc.competitions).filter(Boolean) ||
          [];

        return {
          ...match,
          leagues,
          competitions,
        };
      }),
    );

    return matchesWithDetails;
  } catch (error) {
    console.error("Error in getAllTodayMatches:", error);
    return [];
  }
}

/**
 * Get match with predictions by match ID
 */
export async function getMatchWithPredictions(matchId: string) {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return { match: null, predictions: [] };
  }

  try {
    // Fetch match details
    const match = await getMatchById(matchId);

    if (!match) {
      return { match: null, predictions: [] };
    }

    // Fetch predictions for this match
    const { data: predictions, error: predError } = await supabase
      .from("predictions")
      .select(
        `
        *,
        expert:users!predictions_expert_id_fkey(*)
      `,
      )
      .eq("match_id", matchId)
      .eq("status", "active")
      .order("confidence_score", { ascending: false });

    if (predError) {
      console.error("Error fetching predictions:", predError);
      return { match, predictions: [] };
    }

    return { match, predictions: predictions || [] };
  } catch (error) {
    console.error("Error in getMatchWithPredictions:", error);
    return { match: null, predictions: [] };
  }
}

/**
 * Get all upcoming matches (next 7 days, only scheduled and live)
 */
export async function getAllUpcomingMatches(
  limit: number = 50,
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);

  try {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(*, expert:users!predictions_expert_id_fkey(*))
      `,
      )
      .gte("match_date", today.toISOString())
      .lte("match_date", nextWeek.toISOString())
      .in("status", ["scheduled", "live"])
      .order("match_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching upcoming matches:", error);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        const { data: leagueData } = await supabase
          .from("match_leagues")
          .select("league_id, leagues(*)")
          .eq("match_id", match.id);

        const { data: competitionData } = await supabase
          .from("match_competitions")
          .select("competition_id, competitions(*)")
          .eq("match_id", match.id);

        const leagues =
          leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || [];
        const competitions =
          competitionData?.map((mc: any) => mc.competitions).filter(Boolean) ||
          [];

        return {
          ...match,
          leagues,
          competitions,
        };
      }),
    );

    return matchesWithDetails;
  } catch (error) {
    console.error("Error in getAllUpcomingMatches:", error);
    return [];
  }
}

/**
 * Get matches filtered by league or competition ID
 * @param id - The database ID of the league or competition
 * @param limit - Number of matches to fetch
 */
export async function getMatchesByLeague(
  id: string,
  limit: number = 50,
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  // Get all matches first, then filter by league/competition
  // This is necessary because leagues are in a junction table
  const allMatches = await getAllUpcomingMatches(100);

  // Filter matches that belong to the specified league or competition
  const filteredMatches = allMatches.filter((match) => {
    // Check if any league matches the ID
    const hasMatchingLeague = match.leagues?.some((league) => league.id === id);

    // Check if any competition matches the ID
    const hasMatchingCompetition = match.competitions?.some(
      (competition) => competition.id === id,
    );

    return hasMatchingLeague || hasMatchingCompetition;
  });

  return filteredMatches.slice(0, limit);
}

/**
 * Get matches with combined filters (date + league/competition + sport)
 * @param dateFilter - Filter by date: 'all', 'today', or 'tomorrow'
 * @param leagueOrCompetitionId - Optional database ID to filter by (league or competition)
 * @param limit - Number of matches to fetch
 * @param sportName - Optional sport name to filter by (e.g., 'Football', 'Basketball')
 */
export async function getMatchesWithFilters(
  dateFilter: DateFilter = "all",
  leagueOrCompetitionId: string | null = null,
  limit: number = 50,
  sportName: string | null = null,
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  try {
    // First, get sport ID if sport filter is specified
    let sportId: string | null = null;
    if (sportName && sportName !== "all") {
      const { data: sportData, error: sportError } = await supabase
        .from("sports")
        .select("id")
        .eq("name", sportName)
        .single();

      if (sportError) {
        console.error("Error fetching sport:", sportError);
      } else {
        sportId = sportData?.id || null;
      }
    }

    // Get matches based on date filter
    let matches: MatchWithDetails[] = [];

    switch (dateFilter) {
      case "today":
        matches = await getTodayMatches(100);
        break;
      case "tomorrow":
        matches = await getTomorrowMatches(100);
        break;
      case "all":
      default:
        matches = await getAllUpcomingMatches(100);
        break;
    }

    // Filter by sport if specified
    if (sportId) {
      matches = matches.filter((match) => match.sport_id === sportId);
    }

    // Filter by league/competition if specified
    if (leagueOrCompetitionId) {
      matches = matches.filter((match) => {
        // Check if any league matches the ID
        const hasMatchingLeague = match.leagues?.some(
          (league) => league.id === leagueOrCompetitionId,
        );

        // Check if any competition matches the ID
        const hasMatchingCompetition = match.competitions?.some(
          (competition) => competition.id === leagueOrCompetitionId,
        );

        return hasMatchingLeague || hasMatchingCompetition;
      });
    }

    return matches.slice(0, limit);
  } catch (error) {
    console.error("Error in getMatchesWithFilters:", error);
    return [];
  }
}

/**
 * Get unique leagues and competitions from a set of matches
 * @param matches - Array of matches with details
 * @returns Combined array of unique leagues and competitions
 */
export function getUniqueLeaguesAndCompetitions(
  matches: MatchWithDetails[],
): Array<League | Competition> {
  const uniqueItems = new Map<string, League | Competition>();

  matches.forEach((match) => {
    // Add leagues
    match.leagues?.forEach((league) => {
      if (!uniqueItems.has(league.id)) {
        uniqueItems.set(league.id, league);
      }
    });

    // Add competitions
    match.competitions?.forEach((competition) => {
      if (!uniqueItems.has(competition.id)) {
        uniqueItems.set(competition.id, competition);
      }
    });
  });

  return Array.from(uniqueItems.values());
}

/**
 * Get all leagues and competitions from database
 * @returns Combined array of all leagues and competitions
 */
export async function getAllLeaguesAndCompetitions(): Promise<
  Array<League | Competition>
> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  try {
    // Fetch all leagues
    const { data: leagues, error: leaguesError } = await supabase
      .from("leagues")
      .select("*")
      .order("name", { ascending: true });

    if (leaguesError) {
      console.error("Error fetching leagues:", leaguesError);
    }

    // Fetch all competitions
    const { data: competitions, error: competitionsError } = await supabase
      .from("competitions")
      .select("*")
      .order("name", { ascending: true });

    if (competitionsError) {
      console.error("Error fetching competitions:", competitionsError);
    }

    return [...(leagues || []), ...(competitions || [])];
  } catch (error) {
    console.error("Error in getAllLeaguesAndCompetitions:", error);
    return [];
  }
}
