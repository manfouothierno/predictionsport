'use client';

import { useState } from 'react';
import { TrendingUp, Star, Calendar, Search, Clock, RefreshCcw } from 'lucide-react';
import {  Chip, Button, Tooltip } from "@nextui-org/react";
import Navbar from "@/app/[lang]/langing/Navbar";

const mockMatches = [
    {
        id: 1,
        league: 'Premier League',
        status: 'live',
        minute: 65,
        homeTeam: {
            name: 'Arsenal',
            score: 2,
            stats: {
                possession: 58,
                shots: 12,
                shotsOnTarget: 5,
                corners: 6,
                yellowCards: 1,
                redCards: 0
            }
        },
        awayTeam: {
            name: 'Chelsea',
            score: 1,
            stats: {
                possession: 42,
                shots: 8,
                shotsOnTarget: 3,
                corners: 4,
                yellowCards: 2,
                redCards: 0
            }
        },
        events: [
            { time: 65, type: 'goal', team: 'home', player: 'Smith', detail: 'Goal' },
            { time: 45, type: 'yellow', team: 'away', player: 'Mount', detail: 'Foul' }
        ]
    },
    {
        id: 2,
        league: 'Premier League',
        status: 'live',
        minute: 65,
        homeTeam: {
            name: 'Arsenal',
            score: 2,
            stats: {
                possession: 58,
                shots: 12,
                shotsOnTarget: 5,
                corners: 6,
                yellowCards: 1,
                redCards: 0
            }
        },
        awayTeam: {
            name: 'Chelsea',
            score: 1,
            stats: {
                possession: 42,
                shots: 8,
                shotsOnTarget: 3,
                corners: 4,
                yellowCards: 2,
                redCards: 0
            }
        },
        events: [
            { time: 65, type: 'goal', team: 'home', player: 'Smith', detail: 'Goal' },
            { time: 45, type: 'yellow', team: 'away', player: 'Mount', detail: 'Foul' }
        ]
    },
    {
        id: 3,
        league: 'Premier League',
        status: 'live',
        minute: 65,
        homeTeam: {
            name: 'Arsenal',
            score: 2,
            stats: {
                possession: 58,
                shots: 12,
                shotsOnTarget: 5,
                corners: 6,
                yellowCards: 1,
                redCards: 0
            }
        },
        awayTeam: {
            name: 'Chelsea',
            score: 1,
            stats: {
                possession: 42,
                shots: 8,
                shotsOnTarget: 3,
                corners: 4,
                yellowCards: 2,
                redCards: 0
            }
        },
        events: [
            { time: 65, type: 'goal', team: 'home', player: 'Smith', detail: 'Goal' },
            { time: 45, type: 'yellow', team: 'away', player: 'Mount', detail: 'Foul' }
        ]
    },
    {
        id: 4,
        league: 'Premier League',
        status: 'live',
        minute: 65,
        homeTeam: {
            name: 'Arsenal',
            score: 2,
            stats: {
                possession: 58,
                shots: 12,
                shotsOnTarget: 5,
                corners: 6,
                yellowCards: 1,
                redCards: 0
            }
        },
        awayTeam: {
            name: 'Chelsea',
            score: 1,
            stats: {
                possession: 42,
                shots: 8,
                shotsOnTarget: 3,
                corners: 4,
                yellowCards: 2,
                redCards: 0
            }
        },
        events: [
            { time: 65, type: 'goal', team: 'home', player: 'Smith', detail: 'Goal' },
            { time: 45, type: 'yellow', team: 'away', player: 'Mount', detail: 'Foul' }
        ]
    },
    {
        id: 5,
        league: 'Premier League',
        status: 'live',
        minute: 65,
        homeTeam: {
            name: 'Arsenal',
            score: 2,
            stats: {
                possession: 58,
                shots: 12,
                shotsOnTarget: 5,
                corners: 6,
                yellowCards: 1,
                redCards: 0
            }
        },
        awayTeam: {
            name: 'Chelsea',
            score: 1,
            stats: {
                possession: 42,
                shots: 8,
                shotsOnTarget: 3,
                corners: 4,
                yellowCards: 2,
                redCards: 0
            }
        },
        events: [
            { time: 65, type: 'goal', team: 'home', player: 'Smith', detail: 'Goal' },
            { time: 45, type: 'yellow', team: 'away', player: 'Mount', detail: 'Foul' }
        ]
    },
    {
        id: 6,
        league: 'Premier League',
        status: 'live',
        minute: 65,
        homeTeam: {
            name: 'Arsenal',
            score: 2,
            stats: {
                possession: 58,
                shots: 12,
                shotsOnTarget: 5,
                corners: 6,
                yellowCards: 1,
                redCards: 0
            }
        },
        awayTeam: {
            name: 'Chelsea',
            score: 1,
            stats: {
                possession: 42,
                shots: 8,
                shotsOnTarget: 3,
                corners: 4,
                yellowCards: 2,
                redCards: 0
            }
        },
        events: [
            { time: 65, type: 'goal', team: 'home', player: 'Smith', detail: 'Goal' },
            { time: 45, type: 'yellow', team: 'away', player: 'Mount', detail: 'Foul' }
        ]
    },
    {
        id: 7,
        league: 'Premier League',
        status: 'live',
        minute: 65,
        homeTeam: {
            name: 'Arsenal',
            score: 2,
            stats: {
                possession: 58,
                shots: 12,
                shotsOnTarget: 5,
                corners: 6,
                yellowCards: 1,
                redCards: 0
            }
        },
        awayTeam: {
            name: 'Chelsea',
            score: 1,
            stats: {
                possession: 42,
                shots: 8,
                shotsOnTarget: 3,
                corners: 4,
                yellowCards: 2,
                redCards: 0
            }
        },
        events: [
            { time: 65, type: 'goal', team: 'home', player: 'Smith', detail: 'Goal' },
            { time: 45, type: 'yellow', team: 'away', player: 'Mount', detail: 'Foul' }
        ]
    },
];

export default function LiveScores() {
    const [selectedLeague, setSelectedLeague] = useState('all');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <div className="bg-white pt-20 shadow-sm">
                <div>
                    <div className="max-w-7xl w-full mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Live Scores</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</span>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onClick={() => setLastUpdate(new Date())}
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Search teams..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex gap-6 overflow-x-auto py-4">
                            <button className="flex items-center gap-2 text-red-600 border-b-2 border-red-600 pb-2 px-1">
                                <Star className="w-4 h-4" />
                                <span className="font-medium">Live Now</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 pb-2 px-1">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">Today</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 pb-2 px-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-medium">Finished</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {mockMatches.map((match) => (
                        <div key={match.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Match Header */}
                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-600">{match.league}</div>
                                    {match.status === 'live' && (
                                        <Chip
                                            className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                                            size="sm"
                                            startContent={<div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                                        >
                                            LIVE {match.minute}'
                                        </Chip>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">19:45</span>
                                </div>
                            </div>

                            {/* Score Section */}
                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-4 items-center mb-6">
                                    <div className="text-center">
                                        <div className="font-medium text-gray-900 mb-1">{match.homeTeam.name}</div>
                                        <div className="text-3xl font-bold text-gray-900">{match.homeTeam.score}</div>
                                    </div>
                                    <div className="text-center text-sm text-gray-500">
                                        VS
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-gray-900 mb-1">{match.awayTeam.name}</div>
                                        <div className="text-3xl font-bold text-gray-900">{match.awayTeam.score}</div>
                                    </div>
                                </div>

                                {/* Match Stats */}
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-16 text-right text-sm font-medium text-gray-900">{match.homeTeam.stats.possession}%</div>
                                        <div className="flex-1 mx-4">
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full"
                                                    style={{ width: `${match.homeTeam.stats.possession}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-16 text-sm font-medium text-gray-900">{match.awayTeam.stats.possession}%</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="text-right font-medium text-gray-900">{match.homeTeam.stats.shots}</div>
                                        <div className="text-center text-gray-500">Shots</div>
                                        <div className="text-left font-medium text-gray-900">{match.awayTeam.stats.shots}</div>

                                        <div className="text-right font-medium text-gray-900">{match.homeTeam.stats.shotsOnTarget}</div>
                                        <div className="text-center text-gray-500">On Target</div>
                                        <div className="text-left font-medium text-gray-900">{match.awayTeam.stats.shotsOnTarget}</div>

                                        <div className="text-right font-medium text-gray-900">{match.homeTeam.stats.corners}</div>
                                        <div className="text-center text-gray-500">Corners</div>
                                        <div className="text-left font-medium text-gray-900">{match.awayTeam.stats.corners}</div>
                                    </div>
                                </div>

                                {/* Match Events */}
                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="text-sm font-medium text-gray-900 mb-4">Match Events</h3>
                                    <div className="space-y-3">
                                        {match.events.map((event, index) => (
                                            <div key={index} className="flex items-center gap-3 text-sm">
                                                <span className="w-8 text-right text-gray-500">{event.time}'</span>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    event.type === 'goal' ? 'bg-green-500' :
                                                        event.type === 'yellow' ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                }`} />
                                                <span className="font-medium text-gray-900">{event.player}</span>
                                                <span className="text-gray-500">{event.detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}