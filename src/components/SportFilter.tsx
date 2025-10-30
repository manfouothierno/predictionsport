'use client'

import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { Sport } from '@/types/database'

interface SportFilterProps {
  selectedSportId: string | null
  onSportChange: (sportId: string | null, sportName: string) => void
  sports: Sport[]
  dictionary?: any
}

export default function SportFilter({
  selectedSportId,
  onSportChange,
  sports,
  dictionary
}: SportFilterProps) {
  // Helper function to get sport icon
  const getSportIcon = (sportName: string, logoUrl: string | null) => {
    if (logoUrl) {
      return (
        <Image
          src={logoUrl}
          alt={sportName}
          width={16}
          height={16}
          className="object-contain"
        />
      )
    }

    // Fallback icons based on sport name (using emojis for better compatibility)
    const lowerName = sportName.toLowerCase()
    if (lowerName.includes('football') || lowerName.includes('soccer')) {
      return <span className="text-base">⚽</span>
    } else if (lowerName.includes('basketball')) {
      return <span className="text-base">🏀</span>
    } else if (lowerName.includes('tennis')) {
      return <span className="text-base">🎾</span>
    } else if (lowerName.includes('rugby')) {
      return <span className="text-base">🏉</span>
    } else if (lowerName.includes('baseball')) {
      return <span className="text-base">⚾</span>
    } else if (lowerName.includes('hockey')) {
      return <span className="text-base">🏒</span>
    } else if (lowerName.includes('cricket')) {
      return <span className="text-base">🏏</span>
    } else if (lowerName.includes('volleyball')) {
      return <span className="text-base">🏐</span>
    }

    return <Trophy className="w-4 h-4" />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4">
        {/* Scrollable Sport Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {/* "All" button */}
          <button
            onClick={() => onSportChange(null, 'all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shrink-0 ${
              selectedSportId === null
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{dictionary?.sports?.all || 'All'}</span>
          </button>

          {/* Dynamic sports from database */}
          {sports.map((sport) => {
            const isSelected = selectedSportId === sport.id
            const sportKey = sport.name.toLowerCase()

            return (
              <button
                key={sport.id}
                onClick={() => onSportChange(sport.id, sport.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getSportIcon(sport.name, sport.logo_url)}
                <span>
                  {dictionary?.sports?.[sportKey] || sport.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
