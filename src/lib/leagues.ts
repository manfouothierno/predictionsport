import {
  LucideIcon,
  Trophy,
  Medal,
  Shield,
  Crown,
  Star,
  Target,
  Flame,
  Zap,
  Award,
  CircleDot,
  Footprints,
  Globe,
  Disc,
  Hexagon,
  Sparkles
} from 'lucide-react'

export type LeagueConfig = {
  id: string
  name: string
  icon: LucideIcon
  iconColor: string // Color for the icon
  country?: string
  priority: number // Higher priority appears first
}

export const LEAGUES: LeagueConfig[] = [
  {
    id: 'champions-league',
    name: 'Champions League',
    icon: Trophy,
    iconColor: 'text-blue-600',
    priority: 100
  },
  {
    id: 'europa-league',
    name: 'Europa League',
    icon: Medal,
    iconColor: 'text-orange-500',
    priority: 95
  },
  {
    id: 'conference-league',
    name: 'Conference League',
    icon: Shield,
    iconColor: 'text-green-600',
    priority: 90
  },
  {
    id: 'premier-league',
    name: 'Premier League',
    icon: Crown,
    iconColor: 'text-purple-600',
    country: 'England',
    priority: 85
  },
  {
    id: 'championship',
    name: 'Championship',
    icon: Hexagon,
    iconColor: 'text-indigo-500',
    country: 'England',
    priority: 70
  },
  {
    id: 'league-one',
    name: 'League One',
    icon: Target,
    iconColor: 'text-blue-500',
    country: 'England',
    priority: 65
  },
  {
    id: 'la-liga',
    name: 'LaLiga',
    icon: Flame,
    iconColor: 'text-red-600',
    country: 'Spain',
    priority: 85
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    icon: Zap,
    iconColor: 'text-sky-600',
    country: 'Italy',
    priority: 85
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    icon: Award,
    iconColor: 'text-red-700',
    country: 'Germany',
    priority: 85
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    icon: CircleDot,
    iconColor: 'text-blue-700',
    country: 'France',
    priority: 80
  },
  {
    id: 'liga-portugal',
    name: 'Liga Portugal',
    icon: Star,
    iconColor: 'text-green-700',
    country: 'Portugal',
    priority: 75
  },
  {
    id: 'super-lig',
    name: 'Super Lig',
    icon: Sparkles,
    iconColor: 'text-red-500',
    country: 'Turkey',
    priority: 70
  },
  {
    id: 'premier-soccer-league',
    name: 'Premier Soccer League',
    icon: Globe,
    iconColor: 'text-yellow-600',
    country: 'South Africa',
    priority: 60
  },
  {
    id: 'kenyan-premier-league',
    name: 'Kenyan Premier League',
    icon: Footprints,
    iconColor: 'text-green-600',
    country: 'Kenya',
    priority: 55
  },
  {
    id: 'npfl-premier-league',
    name: 'NPFL Premier League',
    icon: Disc,
    iconColor: 'text-green-700',
    country: 'Nigeria',
    priority: 55
  },
  {
    id: 'major-league-soccer',
    name: 'Major League Soccer',
    icon: Star,
    iconColor: 'text-blue-600',
    country: 'USA',
    priority: 80
  }
]

// Helper function to get league by ID
export function getLeagueById(id: string): LeagueConfig | undefined {
  return LEAGUES.find(league => league.id === id)
}

// Helper function to get leagues sorted by priority
export function getLeaguesByPriority(): LeagueConfig[] {
  return [...LEAGUES].sort((a, b) => b.priority - a.priority)
}

// Map league names from database to our league IDs
export const LEAGUE_NAME_MAPPING: Record<string, string> = {
  'UEFA Champions League': 'champions-league',
  'UEFA Europa League': 'europa-league',
  'UEFA Conference League': 'conference-league',
  'Premier League': 'premier-league',
  'Championship': 'championship',
  'League One': 'league-one',
  'La Liga': 'la-liga',
  'Serie A': 'serie-a',
  'Bundesliga': 'bundesliga',
  'Ligue 1': 'ligue-1',
  'Liga Portugal': 'liga-portugal',
  'Super Lig': 'super-lig',
  'Premier Soccer League': 'premier-soccer-league',
  'FKF Premier League': 'kenyan-premier-league',
  'NPFL': 'npfl-premier-league',
  'Major League Soccer': 'major-league-soccer',
  'MLS': 'major-league-soccer'
}

// Get league ID from database league name
export function getLeagueIdFromName(leagueName: string): string | undefined {
  return LEAGUE_NAME_MAPPING[leagueName]
}
