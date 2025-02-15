'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Timer, ChevronLeft, BarChart2, Users, Percent, DollarSign } from 'lucide-react';
import Navbar from "@/app/[lang]/langing/Navbar";
import Link from "next/link";

export default function MatchAnalysis({ params }: { params: Promise<{ match: string }> }) {
    const [matchDetails, setMatchDetails] = useState<any>(null);
    const [predictions, setPredictions] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Calculate prediction confidence based on available data
    const calculateConfidence = () => {
        if (!predictions) return 65; // Default confidence

        const factors = [
            predictions.prob_HW || 0,
            predictions.prob_AW || 0,
            predictions.prob_D || 0
        ];

        return Math.max(...factors.map(f => parseInt(f) || 0));
    };

    // Determine match prediction
    const getPrediction = () => {
        if (!predictions) return 'No Prediction';

        const homeProb = parseInt(predictions.prob_HW) || 0;
        const awayProb = parseInt(predictions.prob_AW) || 0;
        const drawProb = parseInt(predictions.prob_D) || 0;

        if (homeProb > awayProb && homeProb > drawProb) return 'Home Win';
        if (awayProb > homeProb && awayProb > drawProb) return 'Away Win';
        return 'Draw';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Analysis */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Match Header */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <div className="text-center">
                                    <img
                                        src={matchDetails.team_home_badge}
                                        alt={matchDetails.match_hometeam_name}
                                        className="w-16 h-16 mx-auto object-contain"
                                    />
                                    <h3 className="mt-2 font-semibold text-gray-900">
                                        {matchDetails.match_hometeam_name}
                                    </h3>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-2">VS</div>
                                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium">
                                        {getPrediction()}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <img
                                        src={matchDetails.team_away_badge}
                                        alt={matchDetails.match_awayteam_name}
                                        className="w-16 h-16 mx-auto object-contain"
                                    />
                                    <h3 className="mt-2 font-semibold text-gray-900">
                                        {matchDetails.match_awayteam_name}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Match Details */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Match Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">Date</div>
                                    <div className="font-medium text-gray-900">{matchDetails.match_date}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">Time</div>
                                    <div className="font-medium text-gray-900">{matchDetails.match_time}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">League</div>
                                    <div className="font-medium text-gray-900">{matchDetails.league_name}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">Status</div>
                                    <div className="font-medium text-gray-900">{matchDetails.match_status}</div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis</h2>
                            <div className="space-y-6">
                                {predictions && (
                                    <>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Key Stats</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-start">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2" />
                                                    <span className="text-gray-600">
                                                        Goals scored (avg): Home {predictions.goals_home} - Away {predictions.goals_away}
                                                    </span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2" />
                                                    <span className="text-gray-600">
                                                        Win probability: Home {predictions.prob_HW}% - Away {predictions.prob_AW}%
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Prediction Analysis</h3>
                                            <p className="text-gray-600">
                                                Based on recent form and historical data,
                                                {getPrediction() === 'Home Win'
                                                    ? ` ${matchDetails.match_hometeam_name} is favored to win`
                                                    : getPrediction() === 'Away Win'
                                                        ? ` ${matchDetails.match_awayteam_name} is favored to win`
                                                        : ' the match is expected to be closely contested'
                                                }.
                                            </p>
                                        </div>
                                    </>
                                )}
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
                                            {calculateConfidence()}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-100">
                                    <div
                                        style={{ width: `${calculateConfidence()}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Odds */}
                        {predictions && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-4">Probabilities</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 mb-1">Home Win</div>
                                        <div className="text-lg font-semibold text-gray-900">{predictions.prob_HW}%</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 mb-1">Draw</div>
                                        <div className="text-lg font-semibold text-gray-900">{predictions.prob_D}%</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 mb-1">Away Win</div>
                                        <div className="text-lg font-semibold text-gray-900">{predictions.prob_AW}%</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Comparison */}
                        {predictions && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-4">Goals Prediction</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-2">Expected Goals</div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{predictions.goals_home}</span>
                                            <span className="text-xs text-gray-500">vs</span>
                                            <span className="text-sm font-medium">{predictions.goals_away}</span>
                                        </div>
                                    </div>
                                    {predictions.advice && (
                                        <div>
                                            <div className="text-sm text-gray-500 mb-2">Betting Advice</div>
                                            <p className="text-sm text-gray-600">{predictions.advice}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-center justify-center mt-10">
                            <button className="bg-primary text-white w-full rounded-xl px-4 py-2 font-semibold">
                                <Link href="#">
                                    Place bet now
                                </Link>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}