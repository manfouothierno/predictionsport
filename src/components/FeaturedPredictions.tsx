"use client";

import { useState, useEffect } from "react";
import { MatchWithDetails, League, Competition, Sport } from "@/types/database";
import {
  getMatchesWithFilters,
  DateFilter,
  getUniqueLeaguesAndCompetitions,
  getAllSports,
} from "@/lib/matches";
import PredictionCardWithBetting from "./PredictionCardWithBetting";
import PredictionsSidebar from "./PredictionsSidebar";
import PromotionalBanner from "./PromotionalBanner";
import SportFilter from "./SportFilter";

type LeagueOrCompetition = (League | Competition) & {
  type?: "league" | "competition";
};

interface FeaturedPredictionsProps {
  locale?: string;
  dictionary?: any;
}

export default function FeaturedPredictions({
  locale = "en",
  dictionary,
}: FeaturedPredictionsProps) {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateFilter>("all");
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [selectedSportName, setSelectedSportName] = useState<string>("all");
  const [sports, setSports] = useState<Sport[]>([]);
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [allMatches, setAllMatches] = useState<MatchWithDetails[]>([]);
  const [availableLeaguesAndCompetitions, setAvailableLeaguesAndCompetitions] =
    useState<LeagueOrCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sports from database on mount
  useEffect(() => {
    async function fetchSports() {
      const fetchedSports = await getAllSports();
      setSports(fetchedSports);

      // Set default to Football if available
      const footballSport = fetchedSports.find(
        (s) => s.name.toLowerCase() === "football"
      );
      if (footballSport) {
        setSelectedSportId(footballSport.id);
        setSelectedSportName(footballSport.name);
      }
    }
    fetchSports();
  }, []);

  // Fetch all matches to determine available leagues and competitions
  useEffect(() => {
    async function fetchAllMatches() {
      try {
        const sportName = selectedSportName === "all" ? null : selectedSportName;
        const fetchedMatches = await getMatchesWithFilters(
          selectedDate,
          null,
          100,
          sportName,
        );
        setAllMatches(fetchedMatches);

        // Extract unique leagues and competitions from matches
        const uniqueItems = getUniqueLeaguesAndCompetitions(fetchedMatches);
        setAvailableLeaguesAndCompetitions(uniqueItems);
      } catch (err) {
        console.error("Error fetching all matches:", err);
      }
    }

    fetchAllMatches();
  }, [selectedDate, selectedSportId, selectedSportName]);

  // Filter matches when league or sport selection changes
  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      setError(null);

      try {
        const sportName = selectedSportName === "all" ? null : selectedSportName;
        const fetchedMatches = await getMatchesWithFilters(
          selectedDate,
          selectedLeague,
          24,
          sportName,
        );
        setMatches(fetchedMatches);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError(
          dictionary?.errorLoadingMatches ||
            "Failed to load matches. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [selectedLeague, selectedDate, selectedSportId, selectedSportName, dictionary]);

  // Handler for sport change
  const handleSportChange = (sportId: string | null, sportName: string) => {
    setSelectedSportId(sportId);
    setSelectedSportName(sportName);
    // Reset league filter when changing sport
    setSelectedLeague(null);
  };

  return (
    <section className="bg-gray-50">
      {/* Sport Filter - Mobile Only (sticky at top) */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {/* "All" button */}
            <button
              onClick={() => handleSportChange(null, 'all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shrink-0 ${
                selectedSportId === null
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-base">🏆</span>
              <span>{dictionary?.sports?.all || 'All'}</span>
            </button>

            {/* Dynamic sports from database */}
            {sports.map((sport) => {
              const isSelected = selectedSportId === sport.id
              const sportKey = sport.name.toLowerCase()

              // Get sport icon
              const getSportIcon = () => {
                const lowerName = sport.name.toLowerCase()
                if (lowerName.includes('football') || lowerName.includes('soccer')) return '⚽'
                if (lowerName.includes('basketball')) return '🏀'
                if (lowerName.includes('tennis')) return '🎾'
                if (lowerName.includes('rugby')) return '🏉'
                if (lowerName.includes('baseball')) return '⚾'
                if (lowerName.includes('hockey')) return '🏒'
                return '🏆'
              }

              return (
                <button
                  key={sport.id}
                  onClick={() => handleSportChange(sport.id, sport.name)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-base">{getSportIcon()}</span>
                  <span>
                    {dictionary?.sports?.[sportKey] || sport.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-12 lg:pt-24">
        {/* Header - Desktop Only */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {dictionary?.sportsPredictions?.[selectedSportName.toLowerCase()] ||
              dictionary?.footballPredictions ||
              "Football Predictions"}
          </h1>
          <div className="mt-2 h-1 w-24 bg-primary rounded-full" />
        </div>

        {/* Promotional Banners */}
        {/*<div className="mb-8 space-y-4">
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
        </div>*/}

        {/* Main Layout: Content + Sidebar */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Sidebar - Shows first on mobile, right side on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            {/* Sport Filter - Shows above sidebar on desktop */}
            <div className="hidden lg:block mb-6">
              <SportFilter
                selectedSportId={selectedSportId}
                onSportChange={handleSportChange}
                sports={sports}
                dictionary={dictionary}
              />
            </div>

            <PredictionsSidebar
              selectedLeague={selectedLeague}
              selectedDate={selectedDate}
              onLeagueChange={setSelectedLeague}
              onDateChange={setSelectedDate}
              availableLeaguesAndCompetitions={availableLeaguesAndCompetitions}
              dictionary={dictionary}
            />
          </div>

          {/* Header - Mobile Only (shows between sidebar and content) */}
          <div className="lg:hidden order-2 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {dictionary?.sportsPredictions?.[selectedSportName.toLowerCase()] ||
                dictionary?.footballPredictions ||
                "Football Predictions"}
            </h1>
            <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
          </div>

          {/* Main Content Area - Shows third on mobile, left side on desktop */}
          <div className="order-3 lg:order-1 lg:col-span-3">
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
                  {dictionary?.retry || "Retry"}
                </button>
              </div>
            )}

            {!loading && !error && matches.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">
                  {dictionary?.noMatchesFound ||
                    "No matches found for the selected filters."}
                </p>
                <button
                  onClick={() => {
                    setSelectedLeague(null);
                    setSelectedDate("all");
                  }}
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {dictionary?.clearFilters || "Clear Filters"}
                </button>
              </div>
            )}

            {!loading && !error && matches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
              <div className="mt-6 md:mt-8 text-center">
                <p className="text-sm text-gray-600">
                  {dictionary?.showingResults?.replace(
                    "{count}",
                    matches.length.toString(),
                  ) || `Showing ${matches.length} predictions`}
                </p>
              </div>
            )}
          </div>
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
    </section>
  );
}
