'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Timer, ChevronLeft, BarChart2, Users, Percent, DollarSign, Goal, Scale, ChevronRight } from 'lucide-react';
import Link from "next/link";
import Navbar from "@/app/[lang]/langing/Navbar";

// Score Prediction Component
const ScorePrediction = ({ predictions }) => {
    const getHighestProbScore = () => {
        const overProb = parseFloat(predictions.prob_O) || 0;
        const homeWinProb = parseFloat(predictions.prob_HW) || 0;

        if (homeWinProb > 70 && overProb > 70) {
            return { home: 2, away: 0, probability: Math.floor(homeWinProb * 0.8) };
        } else if (homeWinProb > 70) {
            return { home: 1, away: 0, probability: Math.floor(homeWinProb * 0.7) };
        } else {
            return { home: 1, away: 1, probability: Math.floor((100 - homeWinProb - parseFloat(predictions.prob_AW)) * 0.8) };
        }
    };

    const scorePrediction = getHighestProbScore();

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Most Likely Score</h3>
            <div className="text-center">
                <div className="inline-block bg-red-50 px-6 py-3 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">
                        {scorePrediction.home} - {scorePrediction.away}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        Probability: {scorePrediction.probability}%
                    </div>
                </div>
            </div>
        </div>
    );
};

// Betting Tips Component
const BettingTips = ({ predictions }) => {
    const getTips = () => {
        const tips = [];

        // Over/Under tips
        if (parseFloat(predictions.prob_O) > 75) {
            tips.push({
                tip: "Over 2.5 Goals",
                confidence: predictions.prob_O,
                reasoning: "High probability of a high-scoring match",
                icon: Goal
            });
        }

        // Win probability tips
        if (parseFloat(predictions.prob_HW) > 80) {
            tips.push({
                tip: "Home Win",
                confidence: predictions.prob_HW,
                reasoning: "Strong home team advantage indicated",
                icon: TrendingUp
            });
        }

        // Both teams to score
        if (parseFloat(predictions.prob_bts) > 50) {
            tips.push({
                tip: "Both Teams to Score",
                confidence: predictions.prob_bts,
                reasoning: "Both teams show good attacking form",
                icon: Goal
            });
        }

        return tips;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Key Betting Tips</h3>
            <div className="space-y-4">
                {getTips().map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                            <tip.icon className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">{tip.tip}</div>
                            <div className="text-sm text-gray-500">{tip.reasoning}</div>
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${tip.confidence}%` }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{tip.confidence}% confidence</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Detailed Analysis Component
const DetailedAnalysis = ({ predictions, matchDetails }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Match Analysis</h3>
            <div className="space-y-6">
                {/* Team Formations */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Home Formation</div>
                        <div className="text-lg font-semibold text-gray-900">{matchDetails.match_hometeam_system}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Away Formation</div>
                        <div className="text-lg font-semibold text-gray-900">{matchDetails.match_awayteam_system}</div>
                    </div>
                </div>

                {/* Goal Probabilities */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Over 2.5 Goals</div>
                        <div className="text-lg font-semibold text-gray-900">{predictions.prob_O}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div
                                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${predictions.prob_O}%` }}
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Both Teams to Score</div>
                        <div className="text-lg font-semibold text-gray-900">{predictions.prob_bts}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${predictions.prob_bts}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Asian Handicap Analysis */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Asian Handicap Analysis</h4>
                    <div className="space-y-3">
                        {[
                            { label: "-0.5", home: predictions.prob_ah_h_05, away: predictions.prob_ah_a_05 },
                            { label: "-1.5", home: predictions.prob_ah_h_15, away: predictions.prob_ah_a_15 },
                            { label: "-2.5", home: predictions.prob_ah_h_25, away: predictions.prob_ah_a_25 }
                        ].map((handicap, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>AH {handicap.label}</span>
                                    <span>{handicap.home}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 transition-all duration-500"
                                        style={{ width: `${handicap.home}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Match Header Component
const MatchHeader = ({ matchDetails, predictions }) => {
    const getPrediction = () => {
        const homeProb = parseFloat(predictions.prob_HW) || 0;
        const awayProb = parseFloat(predictions.prob_AW) || 0;
        const drawProb = parseFloat(predictions.prob_D) || 0;

        if (homeProb > awayProb && homeProb > drawProb) return 'Home Win';
        if (awayProb > homeProb && awayProb > drawProb) return 'Away Win';
        return 'Draw';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                    <img
                        src={matchDetails.team_home_badge || '/api/placeholder/64/64'}
                        alt={matchDetails.match_hometeam_name}
                        className="w-16 h-16 mx-auto object-contain"
                    />
                    <h3 className="mt-2 font-semibold text-gray-900">
                        {matchDetails.match_hometeam_name}
                    </h3>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">Prediction</div>
                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium">
                        {getPrediction()}
                    </div>
                </div>
                <div className="text-center">
                    <img
                        src={matchDetails.team_away_badge || '/api/placeholder/64/64'}
                        alt={matchDetails.match_awayteam_name}
                        className="w-16 h-16 mx-auto object-contain"
                    />
                    <h3 className="mt-2 font-semibold text-gray-900">
                        {matchDetails.match_awayteam_name}
                    </h3>
                </div>
            </div>
        </div>
    );
};

// Main Component
export default function MatchAnalysis({ params }) {
    const [matchDetails, setMatchDetails] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                setLoading(true);
                const matchId = (await params).match;

                // Fetch match details
                const today = new Date().toISOString().split('T')[0];
                const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
                    .toISOString().split('T')[0];

                const [matchResponse, predictionResponse] = await Promise.all([
                    fetch(`https://apiv3.apifootball.com/?action=get_events&APIkey=a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004&from=${today}&to=${tomorrow}&match_id=${matchId}`),
                    fetch(`https://apiv3.apifootball.com/?action=get_predictions&APIkey=a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004&from=${today}&to=${tomorrow}&match_id=${matchId}`)
                ]);

                if (!matchResponse.ok || !predictionResponse.ok) {
                    throw new Error('Failed to fetch match data');
                }

                const matchData = await matchResponse.json();
                const predictionData = await predictionResponse.json();

                setMatchDetails(matchData[0]);
                setPredictions(predictionData[0]);
            } catch (err) {
                console.error('Error fetching match data:', err);
                setError('Failed to load match data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMatchData();
    }, [params]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"/>
            </div>
        );
    }

    if (error || !matchDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Error Loading Match</h2>
                    <p className="text-gray-500">{error || 'Match not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="">

                {/* Back button */}
                <Link href="/predictions" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Predictions
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <MatchHeader matchDetails={matchDetails} predictions={predictions} />
                        <ScorePrediction predictions={predictions} />
                        <DetailedAnalysis predictions={predictions} matchDetails={matchDetails} />
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Match Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Date</div>
                                        <div className="font-medium text-gray-900">{matchDetails.match_date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Timer className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Time</div>
                                        <div className="font-medium text-gray-900">{matchDetails.match_time}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <BarChart2 className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">League</div>
                                        <div className="font-medium text-gray-900">{matchDetails.league_name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <BettingTips predictions={predictions} />

                        {/* Win Probabilities */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Win Probabilities</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>Home Win</span>
                                        <span>{predictions.prob_HW}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${predictions.prob_HW}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>Draw</span>
                                        <span>{predictions.prob_D}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${predictions.prob_D}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>Away Win</span>
                                        <span>{predictions.prob_AW}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${predictions.prob_AW}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3 px-1 py-2">
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 font-semibold flex items-center justify-center space-x-2 transition-colors">
                                <span>Place Bet Now</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            {/*<button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-4 py-3 font-semibold flex items-center justify-center space-x-2 transition-colors">*/}
                            {/*    <Users className="w-5 h-5" />*/}
                            {/*    <span>View More Stats</span>*/}
                            {/*</button>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}