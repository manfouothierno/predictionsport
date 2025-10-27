import { Clock } from 'lucide-react'
import Link from 'next/link'
import { MatchWithDetails } from '@/types/database'
import { format } from 'date-fns'

interface UpcomingMatchCardProps {
  match: MatchWithDetails
}

export default function UpcomingMatchCard({ match }: UpcomingMatchCardProps) {
  // Get the first league or competition
  const league = match.leagues?.[0] || match.competitions?.[0]

  // Format date and time
  const matchDate = new Date(match.match_date)
  const formattedDate = format(matchDate, 'yyyy-MM-dd')
  const formattedTime = format(matchDate, 'HH:mm')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* League Header */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
        {league?.logo_url && (
          <img
            src={league.logo_url}
            alt={league.name}
            className="w-4 h-4 object-contain"
          />
        )}
        <span className="text-sm font-semibold text-gray-900 truncate">
          {league?.name || 'League'}
        </span>
      </div>

      {/* Match Content */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 relative">
              <img
                src={match.home_team.logo_url || '/placeholder-team.png'}
                alt={match.home_team.name}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm font-medium text-gray-900 text-center line-clamp-1">
              {match.home_team.name}
            </p>
          </div>

          {/* Match Info */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-medium text-gray-600">Match time & date:</p>
            <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
            <div className="flex items-center gap-1 text-gray-900">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">{formattedTime}</span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 relative">
              <img
                src={match.away_team.logo_url || '/placeholder-team.png'}
                alt={match.away_team.name}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm font-medium text-gray-900 text-center line-clamp-1">
              {match.away_team.name}
            </p>
          </div>
        </div>

        {/* View Prediction Button */}
        <div className="mt-4 flex justify-center">
          <Link
            href={`/predictions/${match.id}`}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-8 py-2 rounded transition-colors duration-200 text-center"
          >
            VIEW PREDICTION
          </Link>
        </div>
      </div>
    </div>
  )
}
