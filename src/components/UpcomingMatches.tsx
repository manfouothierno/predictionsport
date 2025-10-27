'use client'

import { useState, useEffect } from 'react'
import { getUpcomingMatches } from '@/lib/matches'
import { MatchWithDetails } from '@/types/database'
import UpcomingMatchCard from './UpcomingMatchCard'
import PromotionalBanner from '@/components/PromotionalBanner'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface UpcomingMatchesProps {
  limit?: number
  sport?: string
}

export default function UpcomingMatches({ limit = 12, sport = 'Football' }: UpcomingMatchesProps) {
  const [matches, setMatches] = useState<MatchWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true)
        setError(null)
        const data = await getUpcomingMatches(limit, sport)
        setMatches(data)
      } catch (err) {
        console.error('Error fetching matches:', err)
        setError('Failed to load upcoming matches')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [limit, sport])

  return (
    <section className="py-16 bg-gray-50">
      {/* Promotional Banners */}
      <div className="max-w-7xl mx-auto mt-1 sm:px-6 lg:px-8 py-4">
        <PromotionalBanner
          brand="1xbet"
          promoUrl="#"
          bonus="50,000 FCFA"
          brandLogo={'https://v3.traincdn.com/genfiles/cms/55-654/desktop/media_asset/93f175f039aa059b186bc29c157e8cc4.svg'}
        />
        <PromotionalBanner
          brand="melbet"
          promoUrl="#"
          bonus="45,000 FCFA"
          brandLogo={'https://v3.traincdn.com/genfiles/cms/8-62/desktop/media_asset/dd77c8f1b5bd23e38cd81fb7d861af10.svg'}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Upcoming Matches
          </h1>
          <p className="mt-2 text-gray-600">Top expert picks & major leagues</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming matches found.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new matches.</p>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && matches.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <UpcomingMatchCard key={match.id} match={match} />
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-10">
              <Link
                href="/predictions"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                View All Predictions
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
