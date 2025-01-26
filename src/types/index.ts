// types/match.ts
export type TeamStats = {
    possession: number
    shotsTotal: number
    shotsOnTarget: number
    corners: number
    fouls: number
    yellowCards: number
    redCards: number
    offsides: number
}

export type MatchStats = {
    possession: { home: number; away: number }
    shotsOnTarget: { home: number; away: number }
    shotsTotal: { home: number; away: number }
    corners: { home: number; away: number }
    fouls: { home: number; away: number }
    cards: {
        yellow: { home: number; away: number }
        red: { home: number; away: number }
    }
    offsides: { home: number; away: number }
}

export type Team = {
    id: string
    name: string
    shortName: string
    logo: string
    stats: TeamStats
}

export type MatchStatus = 'NOT_STARTED' | 'LIVE' | 'PAUSED' | 'FINISHED' | 'CANCELLED'

export type Match = {
    id: string
    competition: {
        id: string
        name: string
        country: string
        logo: string
    }
    season: {
        id: string
        startDate: string
        endDate: string
        currentMatchday: number
    }
    homeTeam: Team
    awayTeam: Team
    kickoff: string
    venue: {
        id: string
        name: string
        city: string
    }
    status: MatchStatus
    minute: number
    score: {
        home: number
        away: number
        halftime?: {
            home: number
            away: number
        }
        fulltime?: {
            home: number
            away: number
        }
    }
    stats: MatchStats
    events: Array<{
        id: string
        type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION'
        minute: number
        team: 'home' | 'away'
        player: {
            id: string
            name: string
        }
        assist?: {
            id: string
            name: string
        }
    }>
    prediction?: {
        winner: 'home' | 'away' | 'draw'
        score: {
            home: number
            away: number
        }
        confidence: number
    }
}