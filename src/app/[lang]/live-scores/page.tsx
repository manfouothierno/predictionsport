'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Star, Calendar, Search, Clock, RefreshCcw, Filter } from 'lucide-react';
import Navbar from "@/app/[lang]/langing/Navbar";
import MatchCard from "@/components/MatchCard";

export default function LiveScores() {
    const [matches, setMatches] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('all');
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [availableLeagues, setAvailableLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [layout, setLayout] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        const fetchLiveScores = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    'https://apiv3.apifootball.com/?action=get_events&match_live=1&APIkey=a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch live scores');
                }
                const data = await response.json();
                setMatches(data);
                setAvailableLeagues([...new Set(data.map(match => match.league_name))]);
                setError(null);
            } catch (error) {
                setError('Failed to load matches');
                console.error('Error fetching live scores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveScores();
        const intervalId = setInterval(fetchLiveScores, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const filteredMatches = matches.filter(match => {
        const searchTerm = searchQuery.toLowerCase();
        if (selectedLeague === 'all') {
            return match.league_name.toLowerCase().includes(searchTerm) ||
                match.match_hometeam_name.toLowerCase().includes(searchTerm) ||
                match.match_awayteam_name.toLowerCase().includes(searchTerm);
        }
        return match.league_name === selectedLeague &&
            (match.match_hometeam_name.toLowerCase().includes(searchTerm) ||
                match.match_awayteam_name.toLowerCase().includes(searchTerm));
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            {/* Sticky Header */}
            <div className=" sticky pt-16 bg-white shadow-sm">
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
                                        onClick={() => {
                                            setLastUpdate(new Date());
                                            setMatches(prev => [...prev]);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <RefreshCcw className="w-4 h-4 text-gray-400" />
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
                                        layout === 'list' ? 'bg-red-50 text-red-950' : 'text-gray-400 hover:bg-gray-100'
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
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        selectedLeague === 'all'
                                            ? 'bg-red-800 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Star className="w-4 h-4" />
                                    All Leagues
                                </button>
                                {availableLeagues.map((league) => (
                                    <button
                                        key={league}
                                        onClick={() => setSelectedLeague(league)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                            selectedLeague === league
                                                ? 'bg-red-800 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {league}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-8xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-gray-500">{error}</div>
                ) : filteredMatches.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No matches found. Try adjusting your search or filters.
                    </div>
                ) : (
                    <div className={
                        layout === 'grid'
                            ? 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'space-y-6 max-w-4xl mx-auto'
                    }>
                        {filteredMatches.map((match) => (
                            <MatchCard
                                key={match?.match_id}
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