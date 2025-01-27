'use client';

import { useState } from 'react';
import { ChevronDown, Star, TrendingUp, BarChart, Clock, Search, Filter, ChevronRight, Info, X } from 'lucide-react';
import Navbar from "@/app/[lang]/langing/Navbar";

const categoryFilters = [
    { id: 'all', name: 'All Matches', count: 24 },
    { id: 'top-picks', name: 'Top Picks', count: 8 },
    { id: 'high-odds', name: 'High Odds', count: 6 },
    { id: 'trending', name: 'Trending', count: 4 },
    { id: 'live-now', name: 'Live Now', count: 12 }
];

const mockLeagues = [
    {
        id: 1,
        name: 'Premier League',
        country: 'England',
        logo: '/leagues/premier-league.png',
        matches: [
            {
                id: 1,
                homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', rank: '1st' },
                awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', rank: '4th' },
                time: '20:45',
                date: '2025-01-27',
                status: 'hot',
                prediction: 'Home Win',
                confidence: 85,
                odds: { home: 1.95, draw: 3.50, away: 4.20 },
                stats: {
                    homeForm: 'WWDWL',
                    awayForm: 'LWDWD',
                    h2h: 'HWADH',
                    homeGoals: 2.5,
                    awayGoals: 1.2
                }
            },
            {
                id: 2,
                homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', rank: '1st' },
                awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', rank: '4th' },
                time: '20:45',
                date: '2025-01-27',
                status: 'hot',
                prediction: 'Home Win',
                confidence: 85,
                odds: { home: 1.95, draw: 3.50, away: 4.20 },
                stats: {
                    homeForm: 'WWDWL',
                    awayForm: 'LWDWD',
                    h2h: 'HWADH',
                    homeGoals: 2.5,
                    awayGoals: 1.2
                }
            },
            // Add more [match]...
        ]
    },
    {
        id: 2,
        name: ' League 1',
        country: 'France',
        logo: '/leagues/premier-league.png',
        matches: [
            {
                id: 2,
                homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', rank: '1st' },
                awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', rank: '4th' },
                time: '20:45',
                date: '2025-01-27',
                status: 'hot',
                prediction: 'Home Win',
                confidence: 85,
                odds: { home: 1.95, draw: 3.50, away: 4.20 },
                stats: {
                    homeForm: 'WWDWL',
                    awayForm: 'LWDWD',
                    h2h: 'HWADH',
                    homeGoals: 2.5,
                    awayGoals: 1.2
                }
            },
            // Add more [match]...
        ]
    }
];

export default function MatchPredictions() {
    const [activeLeague, setActiveLeague] = useState(mockLeagues[0].id);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewType, setViewType] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('all');

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            {/* Header */}
            <div className="bg-white ">
                <div className="mx-auto pt-20 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Match Predictions</h1>
                            <p className="text-sm text-gray-500 mt-1">Updated predictions for today's matches</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search teams..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>

                            {/* View Toggle */}
                            <div className="flex rounded-lg overflow-hidden border border-gray-200">
                                <button
                                    onClick={() => setViewType('grid')}
                                    className={`px-4 py-2 ${viewType === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewType('list')}
                                    className={`px-4 py-2 ${viewType === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categoryFilters.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                            activeCategory === category.id
                                                ? 'bg-red-50 text-red-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="font-medium">{category.name}</span>
                                        <span className={`text-sm ${
                                            activeCategory === category.id
                                                ? 'text-red-600'
                                                : 'text-gray-400'
                                        }`}>
                      {category.count}
                    </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8">
                                <h3 className="font-semibold text-gray-900 mb-4">Prediction Type</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                        <span className="text-gray-600">1X2</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                        <span className="text-gray-600">Over/Under</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                        <span className="text-gray-600">Both Teams to Score</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="font-semibold text-gray-900 mb-4">Confidence Level</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="confidence" className="text-red-600 focus:ring-red-500" />
                                        <span className="text-gray-600">All</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="confidence" className="text-red-600 focus:ring-red-500" />
                                        <span className="text-gray-600">Above 80%</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="confidence" className="text-red-600 focus:ring-red-500" />
                                        <span className="text-gray-600">Above 90%</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t">
                                <button className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition-colors">
                                    Apply Filters
                                </button>
                                <button className="w-full mt-2 text-gray-500 hover:text-gray-700 text-sm">
                                    Reset All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* League Tabs */}
                        <div className="flex overflow-x-auto gap-4 pb-4 mb-8 scrollbar-hide">
                            {mockLeagues.map((league) => (
                                <button
                                    key={league.id}
                                    onClick={() => setActiveLeague(league.id)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                                        activeLeague === league.id
                                            ? 'bg-red-600 text-white shadow-lg'
                                            : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                        <img src={league.logo} alt={league.name} className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-medium ${activeLeague === league.id ? 'text-white' : 'text-gray-900'}`}>
                                            {league.name}
                                        </p>
                                        <p className={`text-sm ${activeLeague === league.id ? 'text-red-100' : 'text-gray-500'}`}>
                                            {league.matches.length} matches
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Matches Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {mockLeagues
                                .find((l) => l.id === activeLeague)
                                ?.matches.map((match) => (
                                    <div
                                        key={match.id}
                                        className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                                    >
                                        {match.status === 'hot' && (
                                            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-t-xl text-sm font-medium flex items-center justify-between">
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Hot Pick
                        </span>
                                                <span className="text-orange-100">85% Success Rate</span>
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center space-x-3">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{match.time}</span>
                                                    <span className="text-sm text-gray-400">•</span>
                                                    <span className="text-sm text-gray-600">{match.date}</span>
                                                </div>
                                                <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                                                    <Star className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 mb-8">
                                                {/* Home Team */}
                                                <div className="text-center space-y-3">
                                                    <div className="relative w-16 h-16 mx-auto">
                                                        <img
                                                            src={match.homeTeam.logo}
                                                            alt={match.homeTeam.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <span className="absolute -top-2 -right-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                              {match.homeTeam.rank}
                            </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{match.homeTeam.name}</p>
                                                        <div className="mt-2 flex justify-center gap-1">
                                                            {match.stats.homeForm.split('').map((result, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                                                        result === 'W' ? 'bg-green-100 text-green-700' :
                                                                            result === 'D' ? 'bg-yellow-100 text-yellow-700' :
                                                                                'bg-red-100 text-red-700'
                                                                    }`}
                                                                >
                                  {result}
                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Center */}
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="text-sm text-gray-500">VS</div>
                                                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium">
                                                        {match.prediction}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Head to Head
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {match.stats.h2h.split('').map((result, i) => (
                                                            <span
                                                                key={i}
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                                                    result === 'H' ? 'bg-red-100 text-red-700' :
                                                                        result === 'A' ? 'bg-purple-100 text-purple-700' :
                                                                            'bg-gray-100 text-gray-700'
                                                                }`}
                                                            >
                                {result}
                              </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Away Team */}
                                                <div className="text-center space-y-3">
                                                    <div className="relative w-16 h-16 mx-auto">
                                                        <img
                                                            src={match.awayTeam.logo}
                                                            alt={match.awayTeam.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <span className="absolute -top-2 -right-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                              {match.awayTeam.rank}
                            </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{match.awayTeam.name}</p>
                                                        <div className="mt-2 flex justify-center gap-1">
                                                            {match.stats.awayForm.split('').map((result, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                                                        result === 'W' ? 'bg-green-100 text-green-700' :
                                                                            result === 'D' ? 'bg-yellow-100 text-yellow-700' :
                                                                                'bg-red-100 text-red-700'
                                                                    }`}
                                                                >
                                  {result}
                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-4 gap-4 mb-6">
                                                <div className="bg-gray-50 rounded-lg p-3 text-center group-hover:bg-gray-100 transition-colors">
                                                    <TrendingUp className="w-5 h-5 text-red-500 mx-auto mb-1" />
                                                    <p className="text-sm text-gray-600">Confidence</p>
                                                    <p className="font-medium text-gray-900">{match.confidence}%</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3 text-center group-hover:bg-gray-100 transition-colors">
                                                    <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                                                    <p className="text-sm text-gray-600">Best Odds</p>
                                                    <p className="font-medium text-gray-900">{match.odds.home}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3 text-center group-hover:bg-gray-100 transition-colors">
                                                    <BarChart className="w-5 h-5 text-green-500 mx-auto mb-1" />
                                                    <p className="text-sm text-gray-600">Home Goals</p>
                                                    <p className="font-medium text-gray-900">{match.stats.homeGoals}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3 text-center group-hover:bg-gray-100 transition-colors">
                                                    <BarChart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                                                    <p className="text-sm text-gray-600">Away Goals</p>
                                                    <p className="font-medium text-gray-900">{match.stats.awayGoals}</p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Info className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-500">Analysis updated 2h ago</span>
                                                </div>
                                                <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                    View Analysis
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}