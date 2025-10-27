import React from 'react';
import { Clock } from 'lucide-react';
import { MatchWithDetails } from '@/types/database';
import { format } from 'date-fns';

interface LiveMatchCardProps {
  match: MatchWithDetails;
  layout?: 'grid' | 'list';
}

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'live':
      return { text: 'LIVE', color: 'bg-green-500', animate: true };
    case 'completed':
      return { text: 'FT', color: 'bg-gray-500', animate: false };
    case 'scheduled':
      return { text: 'Scheduled', color: 'bg-blue-500', animate: false };
    default:
      return { text: status, color: 'bg-gray-500', animate: false };
  }
};

export default function LiveMatchCard({ match, layout = 'grid' }: LiveMatchCardProps) {
  const league = match.leagues?.[0] || match.competitions?.[0];
  const statusDisplay = getStatusDisplay(match.status);
  const matchTime = format(new Date(match.match_date), 'HH:mm');

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* League Header */}
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            {league?.logo_url && (
              <img
                src={league.logo_url}
                alt={league.name}
                className="w-5 h-5 object-contain"
              />
            )}
            <span className="text-sm font-medium text-gray-700">{league?.name || 'League'}</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white ${statusDisplay.color}`}>
            {statusDisplay.animate && (
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
            {statusDisplay.text}
          </div>
        </div>

        {/* Match Content - List View */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-1">
              <img
                src={match.home_team.logo_url || '/placeholder-team.png'}
                alt={match.home_team.name}
                className="w-10 h-10 object-contain"
              />
              <span className="font-medium text-gray-900">{match.home_team.name}</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 px-6">
              <span className="text-2xl font-bold text-gray-900">
                {match.home_score ?? '-'}
              </span>
              <span className="text-gray-400">:</span>
              <span className="text-2xl font-bold text-gray-900">
                {match.away_score ?? '-'}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <span className="font-medium text-gray-900 text-right">{match.away_team.name}</span>
              <img
                src={match.away_team.logo_url || '/placeholder-team.png'}
                alt={match.away_team.name}
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>

          {/* Match Time */}
          <div className="flex items-center justify-center gap-1.5 mt-3 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{matchTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* League Header */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white ${statusDisplay.color}`}>
          {statusDisplay.animate && (
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          )}
          {statusDisplay.text}
        </div>
      </div>

      {/* Match Content */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={match.home_team.logo_url || '/placeholder-team.png'}
                alt={match.home_team.name}
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <span className="font-medium text-gray-900 truncate">
                {match.home_team.name}
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900 ml-2">
              {match.home_score ?? '-'}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={match.away_team.logo_url || '/placeholder-team.png'}
                alt={match.away_team.name}
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <span className="font-medium text-gray-900 truncate">
                {match.away_team.name}
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900 ml-2">
              {match.away_score ?? '-'}
            </span>
          </div>
        </div>

        {/* Match Time */}
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t text-gray-500 text-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>{matchTime}</span>
        </div>
      </div>
    </div>
  );
}
