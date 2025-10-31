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
  // Get selected league name for display
  const selectedLeagueName = selectedLeague
    ? availableLeaguesAndCompetitions.find(item => item.id === selectedLeague)?.name || 'Select League'
    : dictionary?.all || 'All'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 lg:p-4 lg:sticky lg:top-24">
      {/* League Select - Mobile Only */}
      <div className="mb-3 lg:hidden relative">
        <select
          value={selectedLeague || ''}
          onChange={(e) => onLeagueChange(e.target.value || null)}
          className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1rem',
            paddingRight: '2.5rem'
          }}
        >
          <option value="">
            {availableLeaguesAndCompetitions.length === 0
              ? (dictionary?.noLeaguesAvailable || 'No leagues available')
              : (dictionary?.seeAllCompetitions || 'See all competitions')
            }
          </option>
          {availableLeaguesAndCompetitions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter Tabs */}
      <div className="mb-0 lg:mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => onDateChange('all')}
            className={`flex-1 pb-2 lg:pb-3 text-sm font-medium transition-colors relative ${
              selectedDate === 'all'
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {dictionary?.all || 'All'}
            {selectedDate === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>

          <button
            onClick={() => onDateChange('today')}
            className={`flex-1 pb-2 lg:pb-3 text-sm font-medium transition-colors relative ${
              selectedDate === 'today'
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {dictionary?.today || 'Today'}
            {selectedDate === 'today' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>

          <button
            onClick={() => onDateChange('tomorrow')}
            className={`flex-1 pb-2 lg:pb-3 text-sm font-medium transition-colors relative ${
              selectedDate === 'tomorrow'
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {dictionary?.tomorrow || 'Tomorrow'}
            {selectedDate === 'tomorrow' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* League Filter List - Desktop Only */}
      <div className="space-y-1 hidden lg:block">
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
                    ? 'bg-primary-50 text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                  isSelected ? 'bg-primary-100' : 'bg-gray-100'
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
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            )
          })
        )}
      </div>

      {/* Clear Filters Button - Desktop Only */}
      {(selectedLeague || selectedDate !== 'all') && (
        <div className="mt-6 pt-4 border-t border-gray-200 hidden lg:block">
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
