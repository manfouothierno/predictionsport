'use client';

import { useState, useEffect } from 'react';
import { Star, Search, Clock, ChevronRight, Calendar } from 'lucide-react';
import Navbar from "@/app/[lang]/langing/Navbar";
import Link from 'next/link';

export default function TomorrowMatches() {
    const [matches, setMatches] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [activeLeague, setActiveLeague] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTomorrowMatches = async () => {
            try {
                setLoading(true);
                const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
                    .toISOString().split('T')[0];
                const dayAfterTomorrow = new Date(new Date().setDate(new Date().getDate() + 2))
                    .toISOString().split('T')[0];

                const response = await fetch(
                    `https://apiv3.apifootball.com/?action=get_events&APIkey=a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004&from=${tomorrow}&to=${tomorrow}`
                );

                if (!response.ok) throw new Error('Failed to fetch matches');
                const data = await response.json();

                // Group matches by league
                const groupedMatches = data.reduce((acc, match) => {
                    if (!acc[match.league_id]) {
                        acc[match.league_id] = {
                            id: match.league_id,
                            name: match.league_name,
                            country: match.country_name,
                            logo: match.league_logo || '/placeholder-league.png',
                            matches: []
                        };
                    }
                    acc[match.league_id].matches.push(match);
                    return acc;
                }, {});

                setLeagues(Object.values(groupedMatches));
                setMatches(data);
                if (Object.values(groupedMatches).length > 0) {
                    setActiveLeague('all');
                }
            } catch (err) {
                console.error('Error fetching matches:', err);
                setError('Failed to load matches');
            } finally {
                setLoading(false);
            }
        };

        fetchTomorrowMatches();
    }, []);

    const filteredMatches = activeLeague === 'all'
        ? matches
        : matches.filter(match => match.league_id === activeLeague);

    const searchFilteredMatches = filteredMatches.filter(match =>
        match.match_hometeam_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.match_awayteam_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    const formattedDate = tomorrow.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"/>
                <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading Tomorrow's Matches...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Error Loading Matches</h2>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                {/* Date Header */}
                <div className="bg-white border-b">
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Match Predictions</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {searchFilteredMatches.length} matches available tomorrow
                        </p>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-red-500" />
                            <h4 className="text-xl font-bold text-gray-900">{formattedDate}</h4>

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

                    {/* Search Bar - Mobile Optimized */}
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
                                                <img
                                                    src={league.logo}
                                                    alt={league.name}
                                                    className="w-full h-full object-contain"
                                                />
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
                                        {searchFilteredMatches.length} matches scheduled
                                    </p>
                                </div>
                            </div>

                            {/* Matches Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {searchFilteredMatches.map((match) => (
                                    <Link
                                        key={match.match_id}
                                        href={`/predictions/analysis/${match.match_id}`}
                                        className="block group focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
                                    >
                                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-100">
                                            {/* League & Time Header */}
                                            <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-2.5 flex items-center justify-between border-b">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-5 h-5 bg-white rounded-full p-0.5 shadow-sm">
                                                        <img
                                                            src={match.league_logo || '/placeholder-league.png'}
                                                            alt={match.league_name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-700 font-medium truncate">
                                                        {match.league_name}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {match.match_time}
                                                </span>
                                            </div>

                                            <div className="px-4 py-3">
                                                {/* Teams */}
                                                <div className="flex items-center justify-between gap-4">
                                                    {/* Home Team */}
                                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-16 h-16 rounded-full bg-gray-50 p-1.5 flex-shrink-0">
                                                            <img
                                                                src={match.team_home_badge}
                                                                alt={match.match_hometeam_name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 truncate">
                                                            {match.match_hometeam_name}
                                                        </span>
                                                    </div>

                                                    {/* VS */}
                                                    {/*<span className="text-sm font-medium text-gray-400">VS</span>*/}
                                                    {/* Match Status & Action */}
                                                    <div className="flex items-center  flex-col justify-between px-3 gap-2">
                                                        <div className="inline-flex items-center px-2 py-1 bg-gray-50 rounded-md">

                                                    <span className="text-xs font-medium text-gray-600">
                                                           {match.match_date}
                                                        </span>
                                                        </div>
                                                        <div className="inline-flex items-center px-2 py-1 bg-gray-50 rounded-md">
                                                            <Clock className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                                                            <span className="text-xs font-medium text-gray-600">
                                                           {match.match_time}
                                                        </span>
                                                        </div>

                                                    </div>

                                                    {/* Away Team */}
                                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-0 justify-end">
                                                        <div className="w-16 h-16 rounded-full bg-gray-50 p-1.5 flex-shrink-0">
                                                            <img
                                                                src={match.team_away_badge}
                                                                alt={match.match_awayteam_name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 truncate">
                                                            {match.match_awayteam_name}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end mt-3 pt-3 border-t">
                                                    <button className="flex items-center  gap-1.5 text-xs font-medium text-white bg-red-600 group-hover:bg-red-700 px-2 py-2 rounded-[5px] ">
                                                        View Predictions
                                                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}