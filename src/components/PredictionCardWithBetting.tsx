import { MatchWithDetails, Prediction } from '@/types/database'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface PredictionCardWithBettingProps {
  match: MatchWithDetails
  prediction?: Prediction & {
    prediction_text?: string
  }
  locale?: string
  dictionary?: any
}

export default function PredictionCardWithBetting({
  match,
  prediction,
  locale = 'en',
  dictionary
}: PredictionCardWithBettingProps) {
  // Format match date and time
  const matchDate = new Date(match.match_date)
  const formattedDate = format(matchDate, 'dd MMM yyyy, HH:mm')

  // Get league or competition name
  const leagueName = match.leagues?.[0]?.name || match.competitions?.[0]?.name || 'Football'
  const countryName = match.leagues?.[0]?.name ?
    (match.competitions?.[0]?.is_international ? 'International' : 'League') :
    'International'

  // Generate prediction text
  const predictionText = prediction?.prediction_text ||
    (prediction?.winner_prediction === 'home' ? `${match.home_team.name} wins` :
     prediction?.winner_prediction === 'away' ? `${match.away_team.name} wins` :
     prediction?.winner_prediction === 'draw' ? 'Draw' :
     `${match.home_team.name} wins`)

  // Bonus amount (randomized for demo, should come from API/config)
  const bonusAmount = '260000XAF'

  // 1XBET link (should be affiliate link in production)
  const bettingLink = process.env.NEXT_PUBLIC_1XBET_LINK || 'https://1xbet.com'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with date and league */}
      <div className="pt-6 px-6 pb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{formattedDate}</p>
          <p className="text-sm text-gray-600 mt-1">{countryName} - {leagueName}</p>
        </div>
      </div>

      {/* Teams - Horizontal layout */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center gap-3">
          {/* Home Team */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900">{match.home_team.name}</span>
            <div className="w-10 h-10 relative flex-shrink-0">
              {match.home_team.logo_url ? (
                <Image
                  src={match.home_team.logo_url}
                  alt={match.home_team.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">
                    {match.home_team.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* VS Separator */}
          <span className="text-2xl font-bold text-gray-400 mx-2">-</span>

          {/* Away Team */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative flex-shrink-0">
              {match.away_team.logo_url ? (
                <Image
                  src={match.away_team.logo_url}
                  alt={match.away_team.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">
                    {match.away_team.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="text-base font-bold text-gray-900">{match.away_team.name}</span>
          </div>
        </div>
      </div>

      {/* Prediction Box */}
      <div className="mx-6 mb-5 bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-700 mb-2">
          {match.home_team.name} {match.away_team.name} {dictionary?.predictions || 'Predictions'}
        </p>
        <p className="text-lg font-bold text-gray-900 mb-2">{predictionText}</p>
        <Link
          href={`/${locale}/predictions/${match.id}`}
          className="inline-flex items-center text-sm text-gray-900 hover:text-gray-700 font-medium underline"
        >
          {dictionary?.detail || 'Detail'} <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Betting Section */}
      <div className="px-6 pb-5">
        <div className="flex items-center justify-between gap-4">
          {/* Bonus Amount */}
          <div className="flex flex-col">
            <p className="text-sm text-gray-700">{dictionary?.bonus || 'Bonus'}</p>
            <p className="text-sm text-gray-700">{dictionary?.upTo || 'up to'} :</p>
            <p className="text-lg font-bold text-orange-500 mt-1">{bonusAmount}</p>
          </div>

          {/* BET NOW Button */}
          <a
            href={bettingLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-3 px-10 py-3 bg-primary hover:bg-primary-800 text-white font-bold text-base rounded-full transition-all shadow-md hover:shadow-lg"
          >
            <span>{dictionary?.betNow || 'BET NOW!'}</span>
          </a>
        </div>
      </div>

      {/* View Prediction Button */}
      <div className="px-6 pb-5">
        <Link
          href={`/${locale}/predictions/${match.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base rounded-lg transition-all"
        >
          <span>{dictionary?.viewPrediction || 'View Prediction'}</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
