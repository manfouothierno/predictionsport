'use client';

import { useState, useEffect } from 'react';
import { Star, Search, Calendar, TrendingUp } from 'lucide-react';
import Navbar from "@/app/[lang]/langing/Navbar";
import TopPromoBanner from "@/components/TopPromoBanner";
import { getAllUpcomingMatches } from '@/lib/matches';
import { MatchWithDetails } from '@/types/database';
import UpcomingMatchCard from '@/components/UpcomingMatchCard';
import Link from 'next/link';

// Type for grouped leagues
type LeagueGroup = {
    id: string;
    name: string;
    logo: string | null;
    matches: MatchWithDetails[];
};

export default function PredictionsPage() {
    const [matches, setMatches] = useState<MatchWithDetails[]>([]);
    const [leagues, setLeagues] = useState<LeagueGroup[]>([]);
    const [activeLeague, setActiveLeague] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const data = await getAllUpcomingMatches(100);

                // Group matches by league
                const groupedMatches: { [key: string]: LeagueGroup } = {};

                data.forEach(match => {
                    const league = match.leagues?.[0] || match.competitions?.[0];

                    if (league) {
                        if (!groupedMatches[league.id]) {
                            groupedMatches[league.id] = {
                                id: league.id,
                                name: league.name,
                                logo: league.logo_url,
                                matches: []
                            };
                        }
                        groupedMatches[league.id].matches.push(match);
                    }
                });

                setLeagues(Object.values(groupedMatches));
                setMatches(data);
                setActiveLeague('all');
            } catch (err) {
                console.error('Error fetching matches:', err);
                setError('Failed to load matches');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const filteredMatches = activeLeague === 'all'
        ? matches
        : matches.filter(match => {
            const league = match.leagues?.[0] || match.competitions?.[0];
            return league?.id === activeLeague;
        });

    const searchFilteredMatches = filteredMatches.filter(match =>
        match.home_team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.away_team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.leagues?.[0]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.competitions?.[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto"/>
                    <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading Predictions...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Error Loading Matches</h2>
                    <p className="text-gray-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <TopPromoBanner />
            <div className="pt-32 md:pt-36">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">All Predictions</h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    {searchFilteredMatches.length} upcoming matches in the next 7 days
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div className="flex gap-3">
                                <Link
                                    href="/predictions/today"
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                                >
                                    Today's Matches
                                </Link>
                                <Link
                                    href="/predictions/tomorrow"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                                >
                                    Tomorrow
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Mobile League Selector */}
                    <div className="lg:hidden mb-6">
                        <select
                            value={activeLeague}
                            onChange={(e) => setActiveLeague(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="all">All Leagues ({matches.length})</option>
                            {leagues.map(league => (
                                <option key={league.id} value={league.id}>
                                    {league.name} ({league.matches.length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search teams or leagues..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* League Sidebar - Desktop */}
                        <div className="hidden lg:block w-72 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="font-semibold text-gray-900">Leagues</h2>
                                </div>
                                <div className="divide-y max-h-[calc(100vh-220px)] overflow-y-auto">
                                    <button
                                        onClick={() => setActiveLeague('all')}
                                        className={`w-full flex items-center gap-3 p-3 transition-colors ${
                                            activeLeague === 'all'
                                                ? 'bg-red-50 text-red-600'
                                                : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                                            <Star className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="font-medium">All Leagues</span>
                                            <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">
                                                {matches.length}
                                            </span>
                                        </div>
                                    </button>

                                    {leagues.map((league) => (
                                        <button
                                            key={league.id}
                                            onClick={() => setActiveLeague(league.id)}
                                            className={`w-full flex items-center gap-3 p-3 transition-colors ${
                                                activeLeague === league.id
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'hover:bg-gray-50 text-gray-600'
                                            }`}
                                        >
                                            <div className="w-8 h-8 bg-white rounded-full shadow-sm p-1.5">
                                                {league.logo ? (
                                                    <img
                                                        src={league.logo}
                                                        alt={league.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 rounded-full" />
                                                )}
                                            </div>
                                            <div className="flex-1 flex items-center justify-between">
                                                <span className="font-medium truncate">{league.name}</span>
                                                <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full ml-2">
                                                    {league.matches.length}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {activeLeague === 'all' ? 'All Matches' : leagues.find(l => l.id === activeLeague)?.name}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {searchFilteredMatches.length} matches found
                                    </p>
                                </div>
                            </div>

                            {/* Empty State */}
                            {searchFilteredMatches.length === 0 && (
                                <div className="text-center py-12">
                                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg mb-2">No matches found</p>
                                    <p className="text-gray-400 text-sm">
                                        {searchQuery ? 'Try adjusting your search' : 'No upcoming matches in the next 7 days'}
                                    </p>
                                </div>
                            )}

                            {/* Matches Grid */}
                            {searchFilteredMatches.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {searchFilteredMatches.map((match) => (
                                        <UpcomingMatchCard key={match.id} match={match} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
