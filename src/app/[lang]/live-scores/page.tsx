'use client';

import { useState, useEffect } from 'react';
import { Star, Calendar, Search, Clock, RefreshCcw } from 'lucide-react';
import Navbar from "@/app/[lang]/langing/Navbar";
import LiveMatchCard from "@/components/LiveMatchCard";
import { getLiveMatches } from '@/lib/matches';
import { MatchWithDetails } from '@/types/database';

// Type for grouped leagues
type LeagueInfo = {
    id: string;
    name: string;
};

export default function LiveScores() {
    const [matches, setMatches] = useState<MatchWithDetails[]>([]);
    const [selectedLeague, setSelectedLeague] = useState('all');
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [availableLeagues, setAvailableLeagues] = useState<LeagueInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');

    const fetchLiveScores = async () => {
        try {
            setLoading(true);
            const data = await getLiveMatches();
            setMatches(data);

            // Extract unique leagues
            const leagues = new Map<string, LeagueInfo>();
            data.forEach(match => {
                const league = match.leagues?.[0] || match.competitions?.[0];
                if (league && !leagues.has(league.id)) {
                    leagues.set(league.id, {
                        id: league.id,
                        name: league.name
                    });
                }
            });

            setAvailableLeagues(Array.from(leagues.values()));
            setLastUpdate(new Date());
            setError(null);
        } catch (error) {
            setError('Failed to load live matches');
            console.error('Error fetching live scores:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveScores();
        // Auto-refresh every 60 seconds
        const intervalId = setInterval(fetchLiveScores, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const filteredMatches = matches.filter(match => {
        const searchTerm = searchQuery.toLowerCase();
        const league = match.leagues?.[0] || match.competitions?.[0];
        const leagueName = league?.name || '';

        if (selectedLeague === 'all') {
            return leagueName.toLowerCase().includes(searchTerm) ||
                match.home_team.name.toLowerCase().includes(searchTerm) ||
                match.away_team.name.toLowerCase().includes(searchTerm);
        }

        return league?.id === selectedLeague &&
            (match.home_team.name.toLowerCase().includes(searchTerm) ||
                match.away_team.name.toLowerCase().includes(searchTerm));
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            {/* Sticky Header */}
            <div className="sticky pt-16 bg-white shadow-sm z-10">
                <div className="max-w-8xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 gap-4">
                        {/* Left Section */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Live Scores</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                        Last updated: {lastUpdate.toLocaleTimeString()}
                                    </span>
                                    <button
                                        onClick={fetchLiveScores}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        disabled={loading}
                                    >
                                        <RefreshCcw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 lg:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Search teams or leagues..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setLayout('grid')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        layout === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="grid grid-cols-2 gap-0.5">
                                        <div className="w-1.5 h-1.5 bg-current rounded-sm"/>
                                        <div className="w-1.5 h-1.5 bg-current rounded-sm"/>
                                        <div className="w-1.5 h-1.5 bg-current rounded-sm"/>
                                        <div className="w-1.5 h-1.5 bg-current rounded-sm"/>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setLayout('list')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        layout === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <div className="w-6 h-0.5 bg-current rounded"/>
                                        <div className="w-6 h-0.5 bg-current rounded"/>
                                        <div className="w-6 h-0.5 bg-current rounded"/>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* League Filter */}
                    <div className="border-t">
                        <div className="max-w-8xl mx-auto px-4">
                            <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
                                <button
                                    onClick={() => setSelectedLeague('all')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                                        selectedLeague === 'all'
                                            ? 'bg-red-800 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Star className="w-4 h-4" />
                                    All Leagues ({matches.length})
                                </button>
                                {availableLeagues.map((league) => {
                                    const leagueMatchCount = matches.filter(m => {
                                        const l = m.leagues?.[0] || m.competitions?.[0];
                                        return l?.id === league.id;
                                    }).length;

                                    return (
                                        <button
                                            key={league.id}
                                            onClick={() => setSelectedLeague(league.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                                                selectedLeague === league.id
                                                    ? 'bg-red-800 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Calendar className="w-4 h-4" />
                                            {league.name} ({leagueMatchCount})
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-8xl mx-auto px-4 py-6">
                {loading && matches.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto" />
                            <p className="mt-4 text-gray-600">Loading live matches...</p>
                        </div>
                    </div>
                ) : error && matches.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={fetchLiveScores}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredMatches.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-2">
                            {searchQuery ? 'No matches found' : 'No live matches at the moment'}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {searchQuery ? 'Try adjusting your search' : 'Check back later for live matches'}
                        </p>
                    </div>
                ) : (
                    <div className={
                        layout === 'grid'
                            ? 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'space-y-6 max-w-4xl mx-auto'
                    }>
                        {filteredMatches.map((match) => (
                            <LiveMatchCard
                                key={match.id}
                                match={match}
                                layout={layout}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
