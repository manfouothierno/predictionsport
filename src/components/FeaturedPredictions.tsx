'use client'

import { useState, useEffect } from 'react'
import { MatchWithDetails } from '@/types/database'
import { getMatchesWithFilters, DateFilter } from '@/lib/matches'
import { getLeagueIdFromName } from '@/lib/leagues'
import PredictionCardWithBetting from './PredictionCardWithBetting'
import PredictionsSidebar from './PredictionsSidebar'
import PromotionalBanner from './PromotionalBanner'

interface FeaturedPredictionsProps {
  locale?: string
  dictionary?: any
}

export default function FeaturedPredictions({
  locale = 'en',
  dictionary
}: FeaturedPredictionsProps) {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<DateFilter>('all')
  const [matches, setMatches] = useState<MatchWithDetails[]>([])
  const [allMatches, setAllMatches] = useState<MatchWithDetails[]>([])
  const [availableLeagues, setAvailableLeagues] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all matches to determine available leagues
  useEffect(() => {
    async function fetchAllMatches() {
      try {
        const fetchedMatches = await getMatchesWithFilters(selectedDate, null, 100)
        setAllMatches(fetchedMatches)

        // Extract unique leagues from matches
        const leagueIds = new Set<string>()
        fetchedMatches.forEach(match => {
          match.leagues?.forEach(league => {
            const leagueId = getLeagueIdFromName(league.name)
            if (leagueId) leagueIds.add(leagueId)
          })
          match.competitions?.forEach(competition => {
            const leagueId = getLeagueIdFromName(competition.name)
            if (leagueId) leagueIds.add(leagueId)
          })
        })
        setAvailableLeagues(Array.from(leagueIds))
      } catch (err) {
        console.error('Error fetching all matches:', err)
      }
    }

    fetchAllMatches()
  }, [selectedDate])

  // Filter matches when league selection changes
  useEffect(() => {
    async function fetchMatches() {
      setLoading(true)
      setError(null)

      try {
        const fetchedMatches = await getMatchesWithFilters(selectedDate, selectedLeague, 24)
        setMatches(fetchedMatches)
      } catch (err) {
        console.error('Error fetching matches:', err)
        setError(dictionary?.errorLoadingMatches || 'Failed to load matches. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [selectedLeague, selectedDate, dictionary])

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {dictionary?.footballPredictions || 'Football Predictions'}
          </h1>
          <div className="mt-2 h-1 w-24 bg-orange-500 rounded-full" />
        </div>

        {/* Promotional Banners */}
        <div className="mb-8 space-y-4">
          <PromotionalBanner
            brand="1xbet"
            brandLogo="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/1xBet_logo.svg/320px-1xBet_logo.svg.png"
            promoUrl={process.env.NEXT_PUBLIC_1XBET_LINK || "https://1xbet.com"}
          />
          <PromotionalBanner
            brand="melbet"
            brandLogo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Melbet_logo.svg/320px-Melbet_logo.svg.png"
            promoUrl={process.env.NEXT_PUBLIC_MELBET_LINK || "https://melbet.com"}
          />
        </div>

        {/* Main Layout: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area (3 columns on desktop) */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-lg h-96 animate-pulse"
                  />
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {dictionary?.retry || 'Retry'}
                </button>
              </div>
            )}

            {!loading && !error && matches.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">
                  {dictionary?.noMatchesFound || 'No matches found for the selected filters.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedLeague(null)
                    setSelectedDate('all')
                  }}
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {dictionary?.clearFilters || 'Clear Filters'}
                </button>
              </div>
            )}

            {!loading && !error && matches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match) => (
                  <PredictionCardWithBetting
                    key={match.id}
                    match={match}
                    locale={locale}
                    dictionary={dictionary}
                  />
                ))}
              </div>
            )}

            {/* Results Count */}
            {!loading && !error && matches.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  {dictionary?.showingResults?.replace('{count}', matches.length.toString()) ||
                   `Showing ${matches.length} predictions`}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar (1 column on desktop) */}
          <div className="lg:col-span-1">
            <PredictionsSidebar
              selectedLeague={selectedLeague}
              selectedDate={selectedDate}
              onLeagueChange={setSelectedLeague}
              onDateChange={setSelectedDate}
              availableLeagues={availableLeagues}
              dictionary={dictionary}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
