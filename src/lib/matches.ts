import { supabase } from '@/lib/supabase'
import { MatchWithDetails, Match, Team, League, Competition } from '@/types/database'

/**
 * Fetch upcoming matches from Supabase
 * @param limit - Number of matches to fetch (default: 12)
 * @param sport - Filter by sport name (optional)
 * @returns Array of matches with team and league details
 */
export async function getUpcomingMatches(
  limit: number = 12,
  sport: string = 'Football'
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  try {
    // First, get the sport ID
    const { data: sportData, error: sportError } = await supabase
      .from('sports')
      .select('id')
      .eq('name', sport)
      .single()

    if (sportError) {
      console.error('Error fetching sport:', sportError)
      return []
    }

    // Fetch upcoming matches with team details
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*)
      `)
      .eq('sport_id', sportData.id)
      .eq('status', 'scheduled')
      .gte('match_date', new Date().toISOString())
      .order('match_date', { ascending: true })
      .limit(limit)

    if (matchError) {
      console.error('Error fetching matches:', matchError)
      return []
    }

    if (!matches || matches.length === 0) {
      return []
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        // Fetch leagues
        const { data: leagueData } = await supabase
          .from('match_leagues')
          .select('league_id, leagues(*)')
          .eq('match_id', match.id)

        // Fetch competitions
        const { data: competitionData } = await supabase
          .from('match_competitions')
          .select('competition_id, competitions(*)')
          .eq('match_id', match.id)

        const leagues = leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || []
        const competitions = competitionData?.map((mc: any) => mc.competitions).filter(Boolean) || []

        return {
          ...match,
          leagues,
          competitions,
        }
      })
    )

    return matchesWithDetails
  } catch (error) {
    console.error('Error in getUpcomingMatches:', error)
    return []
  }
}

/**
 * Fetch a single match by ID with all details
 */
export async function getMatchById(matchId: string): Promise<MatchWithDetails | null> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  try {
    const { data: match, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*)
      `)
      .eq('id', matchId)
      .single()

    if (error) {
      console.error('Error fetching match:', error)
      return null
    }

    // Fetch leagues and competitions
    const { data: leagueData } = await supabase
      .from('match_leagues')
      .select('league_id, leagues(*)')
      .eq('match_id', match.id)

    const { data: competitionData } = await supabase
      .from('match_competitions')
      .select('competition_id, competitions(*)')
      .eq('match_id', match.id)

    const leagues = leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || []
    const competitions = competitionData?.map((mc: any) => mc.competitions).filter(Boolean) || []

    return {
      ...match,
      leagues,
      competitions,
    }
  } catch (error) {
    console.error('Error in getMatchById:', error)
    return null
  }
}

/**
 * Get matches by date range
 */
export async function getMatchesByDateRange(
  startDate: Date,
  endDate: Date,
  limit: number = 50
): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*)
      `)
      .gte('match_date', startDate.toISOString())
      .lte('match_date', endDate.toISOString())
      .order('match_date', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching matches by date range:', error)
      return []
    }

    if (!matches || matches.length === 0) {
      return []
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        // Fetch leagues
        const { data: leagueData } = await supabase
          .from('match_leagues')
          .select('league_id, leagues(*)')
          .eq('match_id', match.id)

        // Fetch competitions
        const { data: competitionData } = await supabase
          .from('match_competitions')
          .select('competition_id, competitions(*)')
          .eq('match_id', match.id)

        const leagues = leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || []
        const competitions = competitionData?.map((mc: any) => mc.competitions).filter(Boolean) || []

        return {
          ...match,
          leagues,
          competitions,
        }
      })
    )

    return matchesWithDetails
  } catch (error) {
    console.error('Error in getMatchesByDateRange:', error)
    return []
  }
}

/**
 * Get tomorrow's matches
 */
export async function getTomorrowMatches(limit: number = 100): Promise<MatchWithDetails[]> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)
  dayAfterTomorrow.setHours(23, 59, 59, 999)

  return getMatchesByDateRange(tomorrow, dayAfterTomorrow, limit)
}

/**
 * Get today's matches
 */
export async function getTodayMatches(limit: number = 100): Promise<MatchWithDetails[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endOfToday = new Date(today)
  endOfToday.setHours(23, 59, 59, 999)

  return getMatchesByDateRange(today, endOfToday, limit)
}

/**
 * Get live matches (status = 'live')
 */
export async function getLiveMatches(limit: number = 100): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  try {
    // Fetch live matches with team details
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*)
      `)
      .eq('status', 'live')
      .order('match_date', { ascending: true })
      .limit(limit)

    if (matchError) {
      console.error('Error fetching live matches:', matchError)
      return []
    }

    if (!matches || matches.length === 0) {
      return []
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        // Fetch leagues
        const { data: leagueData } = await supabase
          .from('match_leagues')
          .select('league_id, leagues(*)')
          .eq('match_id', match.id)

        // Fetch competitions
        const { data: competitionData } = await supabase
          .from('match_competitions')
          .select('competition_id, competitions(*)')
          .eq('match_id', match.id)

        const leagues = leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || []
        const competitions = competitionData?.map((mc: any) => mc.competitions).filter(Boolean) || []

        return {
          ...match,
          leagues,
          competitions,
        }
      })
    )

    return matchesWithDetails
  } catch (error) {
    console.error('Error in getLiveMatches:', error)
    return []
  }
}

/**
 * Get all matches for today (both live and scheduled)
 */
export async function getAllTodayMatches(limit: number = 100): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endOfToday = new Date(today)
  endOfToday.setHours(23, 59, 59, 999)

  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*)
      `)
      .gte('match_date', today.toISOString())
      .lte('match_date', endOfToday.toISOString())
      .in('status', ['live', 'scheduled', 'completed'])
      .order('match_date', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching all today matches:', error)
      return []
    }

    if (!matches || matches.length === 0) {
      return []
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        const { data: leagueData } = await supabase
          .from('match_leagues')
          .select('league_id, leagues(*)')
          .eq('match_id', match.id)

        const { data: competitionData } = await supabase
          .from('match_competitions')
          .select('competition_id, competitions(*)')
          .eq('match_id', match.id)

        const leagues = leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || []
        const competitions = competitionData?.map((mc: any) => mc.competitions).filter(Boolean) || []

        return {
          ...match,
          leagues,
          competitions,
        }
      })
    )

    return matchesWithDetails
  } catch (error) {
    console.error('Error in getAllTodayMatches:', error)
    return []
  }
}

/**
 * Get match with predictions by match ID
 */
export async function getMatchWithPredictions(matchId: string) {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return { match: null, predictions: [] }
  }

  try {
    // Fetch match details
    const match = await getMatchById(matchId)

    if (!match) {
      return { match: null, predictions: [] }
    }

    // Fetch predictions for this match
    const { data: predictions, error: predError } = await supabase
      .from('predictions')
      .select(`
        *,
        expert:users!predictions_expert_id_fkey(*)
      `)
      .eq('match_id', matchId)
      .eq('status', 'active')
      .order('confidence_score', { ascending: false })

    if (predError) {
      console.error('Error fetching predictions:', predError)
      return { match, predictions: [] }
    }

    return { match, predictions: predictions || [] }
  } catch (error) {
    console.error('Error in getMatchWithPredictions:', error)
    return { match: null, predictions: [] }
  }
}

/**
 * Get all upcoming matches (next 7 days)
 */
export async function getAllUpcomingMatches(limit: number = 50): Promise<MatchWithDetails[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  nextWeek.setHours(23, 59, 59, 999)

  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*)
      `)
      .gte('match_date', today.toISOString())
      .lte('match_date', nextWeek.toISOString())
      .eq('status', 'scheduled')
      .order('match_date', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching upcoming matches:', error)
      return []
    }

    if (!matches || matches.length === 0) {
      return []
    }

    // Fetch leagues and competitions for each match
    const matchesWithDetails: MatchWithDetails[] = await Promise.all(
      matches.map(async (match) => {
        const { data: leagueData } = await supabase
          .from('match_leagues')
          .select('league_id, leagues(*)')
          .eq('match_id', match.id)

        const { data: competitionData } = await supabase
          .from('match_competitions')
          .select('competition_id, competitions(*)')
          .eq('match_id', match.id)

        const leagues = leagueData?.map((ml: any) => ml.leagues).filter(Boolean) || []
        const competitions = competitionData?.map((mc: any) => mc.competitions).filter(Boolean) || []

        return {
          ...match,
          leagues,
          competitions,
        }
      })
    )

    return matchesWithDetails
  } catch (error) {
    console.error('Error in getAllUpcomingMatches:', error)
    return []
  }
}
