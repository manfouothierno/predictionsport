
'use client';

import { TrendingUp, Calendar, Timer, ChevronLeft, BarChart2, Users, Percent, DollarSign } from 'lucide-react';
import Navbar from "@/app/[lang]/langing/Navbar";

const mockAnalysis = {
    match: {
        id: 1,
        homeTeam: { name: 'Arsenal', logo: '/teams/arsenal.png', rank: '1st' },
        awayTeam: { name: 'Chelsea', logo: '/teams/chelsea.png', rank: '4th' },
        time: '20:45',
        date: '2025-01-27',
        venue: 'Emirates Stadium',
        prediction: 'Home Win',
        confidence: 85,
        odds: { home: 1.95, draw: 3.50, away: 4.20 },
        keyStats: {
            homeForm: ['W', 'W', 'D', 'W', 'L'],
            awayForm: ['L', 'W', 'D', 'W', 'D'],
            headToHead: ['H', 'W', 'A', 'D', 'H'],
            homeScoringAvg: 2.5,
            awayScoringAvg: 1.2
        },
        analysis: {
            strengths: [
                'Arsenal strong home record (W8 D1 L1)',
                'Chelsea struggling in away games',
                'Arsenal scored in last 15 home games'
            ],
            weaknesses: [
                'Key defender injured',
                'Recent defensive issues',
                'High-pressure game'
            ],
            verdict: "Arsenal's strong home form and Chelsea's away struggles make this a favorable home win prediction. Arsenal has been particularly strong at the Emirates this season, while Chelsea has shown inconsistency in away [match]."
        }
    }
};

export default function MatchAnalysis() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            {/*<div className="bg-white border-b">*/}
            {/*    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">*/}
            {/*        <button className="inline-flex items-center text-gray-600 hover:text-gray-900">*/}
            {/*            <ChevronLeft className="w-5 h-5 mr-1" />*/}
            {/*            Back to Predictions*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <Navbar/>

            <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Analysis */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Match Header */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <div className="text-center">
                                    <img src={mockAnalysis.match.homeTeam.logo} alt={mockAnalysis.match.homeTeam.name} className="w-16 h-16 mx-auto" />
                                    <h3 className="mt-2 font-semibold text-gray-900">{mockAnalysis.match.homeTeam.name}</h3>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-2">VS</div>
                                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium">
                                        {mockAnalysis.match.prediction}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <img src={mockAnalysis.match.awayTeam.logo} alt={mockAnalysis.match.awayTeam.name} className="w-16 h-16 mx-auto" />
                                    <h3 className="mt-2 font-semibold text-gray-900">{mockAnalysis.match.awayTeam.name}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Match Details */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Match Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">Date</div>
                                    <div className="font-medium text-gray-900">{mockAnalysis.match.date}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">Time</div>
                                    <div className="font-medium text-gray-900">{mockAnalysis.match.time}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">Venue</div>
                                    <div className="font-medium text-gray-900">{mockAnalysis.match.venue}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">Prediction</div>
                                    <div className="font-medium text-red-600">{mockAnalysis.match.prediction}</div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Strengths</h3>
                                    <ul className="space-y-2">
                                        {mockAnalysis.match.analysis.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2" />
                                                <span className="text-gray-600">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Weaknesses</h3>
                                    <ul className="space-y-2">
                                        {mockAnalysis.match.analysis.weaknesses.map((weakness, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2" />
                                                <span className="text-gray-600">{weakness}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Verdict</h3>
                                    <p className="text-gray-600">{mockAnalysis.match.analysis.verdict}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Confidence Score */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Prediction Confidence</h3>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-100">
                      Confidence
                    </span>
                                    </div>
                                    <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-red-600">
                      {mockAnalysis.match.confidence}%
                    </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-100">
                                    <div
                                        style={{ width: `${mockAnalysis.match.confidence}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Odds */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Best Odds</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Home</div>
                                    <div className="text-lg font-semibold text-gray-900">{mockAnalysis.match.odds.home}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Draw</div>
                                    <div className="text-lg font-semibold text-gray-900">{mockAnalysis.match.odds.draw}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Away</div>
                                    <div className="text-lg font-semibold text-gray-900">{mockAnalysis.match.odds.away}</div>
                                </div>
                            </div>
                        </div>

                        {/* Form Guide */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Form</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 mb-2">{mockAnalysis.match.homeTeam.name}</div>
                                    <div className="flex gap-1">
                                        {mockAnalysis.match.keyStats.homeForm.map((result, i) => (
                                            <span
                                                key={i}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
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
                                <div>
                                    <div className="text-sm text-gray-500 mb-2">{mockAnalysis.match.awayTeam.name}</div>
                                    <div className="flex gap-1">
                                        {mockAnalysis.match.keyStats.awayForm.map((result, i) => (
                                            <span
                                                key={i}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
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

                        {/* Head to Head */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Head to Head</h3>
                            <div className="flex gap-1 justify-center">
                                {mockAnalysis.match.keyStats.headToHead.map((result, i) => (
                                    <span
                                        key={i}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
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
                    </div>
                </div>
            </div>
        </div>
    );
}