'use client';

import {
    TrendingUp,
    Star,
    Info,
    ChevronRight,
    Filter,
    Search,
    ArrowUp,
    ArrowDown,
    Command,
    Calendar
} from 'lucide-react';
import {Button} from "@nextui-org/react";
import {Chip} from "@nextui-org/chip";
import {Tooltip} from "recharts";
import Navbar from "@/app/[lang]/langing/Navbar";
import TopPromoBanner from "@/components/TopPromoBanner";
import {useRouter} from "next/navigation";

const mockMatches = [
    {
        id: 1,
        league: 'Premier League',
        homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', form: 'WWDWL' },
        awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', form: 'LWDWD' },
        time: '20:45',
        date: '2025-01-27',
        status: 'hot',
        prediction: 'Home Win',
        confidence: 85,
        odds: { home: 1.95, draw: 3.50, away: 4.20 },
        predictedScore: '2-0',
        analysis: {
            summary: 'Strong home record vs Chelsea\'s away struggles',
            keyPoints: ['Arsenal won last 5 home games', 'Chelsea struggling in away [match]']
        }
    },
    {
        id: 2,
        league: 'Premier League',
        homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', form: 'WWDWL' },
        awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', form: 'LWDWD' },
        time: '20:45',
        date: '2025-01-27',
        status: 'hot',
        prediction: 'Home Win',
        confidence: 85,
        odds: { home: 1.95, draw: 3.50, away: 4.20 },
        predictedScore: '2-0',
        analysis: {
            summary: 'Strong home record vs Chelsea\'s away struggles',
            keyPoints: ['Arsenal won last 5 home games', 'Chelsea struggling in away [match]']
        }
    },
    {
        id: 3,
        league: 'Premier League',
        homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', form: 'WWDWL' },
        awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', form: 'LWDWD' },
        time: '20:45',
        date: '2025-01-27',
        status: 'hot',
        prediction: 'Home Win',
        confidence: 85,
        odds: { home: 1.95, draw: 3.50, away: 4.20 },
        predictedScore: '2-0',
        analysis: {
            summary: 'Strong home record vs Chelsea\'s away struggles',
            keyPoints: ['Arsenal won last 5 home games', 'Chelsea struggling in away [match]']
        }
    },
    {
        id: 4,
        league: 'Premier League',
        homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', form: 'WWDWL' },
        awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', form: 'LWDWD' },
        time: '20:45',
        date: '2025-01-27',
        status: 'hot',
        prediction: 'Home Win',
        confidence: 85,
        odds: { home: 1.95, draw: 3.50, away: 4.20 },
        predictedScore: '2-0',
        analysis: {
            summary: 'Strong home record vs Chelsea\'s away struggles',
            keyPoints: ['Arsenal won last 5 home games', 'Chelsea struggling in away [match]']
        }
    },
    {
        id: 5,
        league: 'Premier League',
        homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', form: 'WWDWL' },
        awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', form: 'LWDWD' },
        time: '20:45',
        date: '2025-01-27',
        status: 'hot',
        prediction: 'Home Win',
        confidence: 85,
        odds: { home: 1.95, draw: 3.50, away: 4.20 },
        predictedScore: '2-0',
        analysis: {
            summary: 'Strong home record vs Chelsea\'s away struggles',
            keyPoints: ['Arsenal won last 5 home games', 'Chelsea struggling in away [match]']
        }
    },
    {
        id: 6,
        league: 'Premier League',
        homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', form: 'WWDWL' },
        awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', form: 'LWDWD' },
        time: '20:45',
        date: '2025-01-27',
        status: 'hot',
        prediction: 'Home Win',
        confidence: 85,
        odds: { home: 1.95, draw: 3.50, away: 4.20 },
        predictedScore: '2-0',
        analysis: {
            summary: 'Strong home record vs Chelsea\'s away struggles',
            keyPoints: ['Arsenal won last 5 home games', 'Chelsea struggling in away [match]']
        }
    },
    // Add more [match]
];

export default function AnalysisList() {
    const router = useRouter();
    return (
        <div>
            <Navbar/>
            <TopPromoBanner/>
            <div className="min-h-screen pt-32 md:pt-36 bg-gray-50">

                <div className="bg-white shadow-sm">

                    <div className="max-w-7xl w-full mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Match Analysis</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Chip color="warning" variant="flat" size="sm">Premier League</Chip>
                                    <Chip color="warning" variant="flat" size="sm">La Liga</Chip>
                                    <Chip color="warning" variant="flat" size="sm">+3 more</Chip>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Search matches..."
                                    />
                                    <div className="hidden group-hover:flex absolute right-3 top-1/2 -translate-y-1/2 items-center text-xs text-gray-400">
                                        <Command className="w-3 h-3 mr-1" />
                                        K
                                    </div>
                                </div>

                                <Tooltip content="Filter matches">
                                    <Button
                                        isIconOnly
                                        variant="bordered"
                                        className="border-gray-200"
                                    >
                                        <Filter className="h-4 w-4 text-gray-500" />
                                    </Button>
                                </Tooltip>

                                <Button
                                    color="danger"
                                    variant="shadow"
                                    className="hidden md:flex"
                                >
                                    Today's Hot Picks
                                </Button>
                            </div>
                        </div>
                    </div>


                    <div className="border-t">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex gap-6 overflow-x-auto py-4">
                                <button className="flex items-center gap-2 text-red-600 border-b-2 border-red-600 pb-2 px-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-medium whitespace-nowrap">Today's Matches</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 pb-2 px-1">
                                    <Star className="w-4 h-4" />
                                    <span className="font-medium whitespace-nowrap">Top Predictions</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 pb-2 px-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="font-medium whitespace-nowrap">Trending</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 border-b">
                            <div className="col-span-4">Match</div>
                            <div className="col-span-2">Prediction</div>
                            <div className="col-span-1 text-center">
                                <button className="inline-flex items-center hover:text-gray-900">
                                    Confidence
                                    <ArrowDown className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                            <div className="col-span-1 text-center">Score</div>
                            <div className="col-span-3">Analysis</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {mockMatches.map((match) => (
                                <div
                                    key={match.id}
                                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 group"
                                >
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-4">
                                            {match.status === 'hot' && (
                                                <Chip
                                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                                    size="sm"
                                                >
                                                    HOT
                                                </Chip>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">{match.league}</span>
                                                    <Tooltip content="League Ranking: 1st">
                                                        <Star className="w-3 h-3 text-yellow-500" />
                                                    </Tooltip>
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    {match.homeTeam.name} vs {match.awayTeam.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {match.date} • {match.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <Chip
                                            className="bg-red-50 text-red-700 font-medium"
                                            radius="full"
                                        >
                                            {match.prediction}
                                        </Chip>
                                    </div>

                                    <div className="col-span-1 text-center">
                                        <div className="font-medium text-gray-900">{match.confidence}%</div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                            <div
                                                className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full transition-all"
                                                style={{ width: `${match.confidence}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-1 text-center">
                                        <Tooltip content="Predicted Score">
                                            <span className="font-medium text-gray-900">{match.predictedScore}</span>
                                        </Tooltip>
                                    </div>

                                    <div className="col-span-3">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {match.analysis.summary}
                                        </p>
                                    </div>

                                    <div className="col-span-1 text-right">
                                        <Button
                                            color="danger"
                                            variant="light"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            endContent={<ChevronRight className="w-4 h-4" />}
                                            onClick={() => router.push(`/predictions/analysis/${match.id}`)}
                                        >
                                            Details
                                        </Button>
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