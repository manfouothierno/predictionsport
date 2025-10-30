'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Trophy } from 'lucide-react'
import { League, Competition } from '@/types/database'

export type DateFilter = 'all' | 'today' | 'tomorrow'

type LeagueOrCompetition = (League | Competition) & {
  type?: 'league' | 'competition'
}

interface PredictionsSidebarProps {
  selectedLeague: string | null
  selectedDate: DateFilter
  onLeagueChange: (leagueId: string | null) => void
  onDateChange: (date: DateFilter) => void
  availableLeaguesAndCompetitions: LeagueOrCompetition[]
  dictionary?: any
}

export default function PredictionsSidebar({
  selectedLeague,
  selectedDate,
  onLeagueChange,
  onDateChange,
  availableLeaguesAndCompetitions,
  dictionary
}: PredictionsSidebarProps) {
  const [betTypesOpen, setBetTypesOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
      {/* Bet Types Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setBetTypesOpen(!betTypesOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
        >
          <span>{dictionary?.betTypes || 'Bet types'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${betTypesOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown content (can be expanded later) */}
        {betTypesOpen && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500">{dictionary?.allBetTypes || 'All bet types available'}</p>
          </div>
        )}
      </div>

      {/* Date Filter Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => onDateChange('all')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
              selectedDate === 'all'
                ? 'text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {dictionary?.all || 'All'}
            {selectedDate === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>

          <button
            onClick={() => onDateChange('today')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
              selectedDate === 'today'
                ? 'text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {dictionary?.today || 'Today'}
            {selectedDate === 'today' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>

          <button
            onClick={() => onDateChange('tomorrow')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
              selectedDate === 'tomorrow'
                ? 'text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {dictionary?.tomorrow || 'Tomorrow'}
            {selectedDate === 'tomorrow' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        </div>
      </div>

      {/* League Filter List */}
      <div className="space-y-1">
        {availableLeaguesAndCompetitions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              {dictionary?.noLeaguesAvailable || 'No leagues available for selected date'}
            </p>
          </div>
        ) : (
          availableLeaguesAndCompetitions.map((item) => {
            const isSelected = selectedLeague === item.id

            return (
              <button
                key={item.id}
                onClick={() => onLeagueChange(isSelected ? null : item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                  isSelected ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  {item.logo_url ? (
                    <Image
                      src={item.logo_url}
                      alt={item.name}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  ) : (
                    <Trophy className="w-4 h-4" />
                  )}
                </div>

                <span className="text-sm font-medium flex-1 text-left">
                  {item.name}
                </span>

                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                )}
              </button>
            )
          })
        )}
      </div>

      {/* Clear Filters Button */}
      {(selectedLeague || selectedDate !== 'all') && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              onLeagueChange(null)
              onDateChange('all')
            }}
            className="w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {dictionary?.clearFilters || 'Clear Filters'}
          </button>
        </div>
      )}
    </div>
  )
}
