'use client';

import { useState, useEffect } from 'react';
import {
    TrendingUp, Calendar, Timer, ChevronLeft, BarChart2,
    CheckCircle, XCircle, Scale, ChevronRight, Goal,
    Users, DollarSign, Brain, Sparkles, Banknote, Loader2,
    Shield, Activity, Clock, AlertTriangle
} from 'lucide-react';
import Link from "next/link";
import Navbar from "@/app/[lang]/langing/Navbar";
import {
    AIKeyPredictions,
    AIOutcomePrediction, AIScorePrediction,
    AITacticalInsights
} from "@/app/[lang]/predictions/analysis/[match]/components/AiPredictionComponents";
import {fetchMatchData, getAIAnalysis} from "@/services/predictionService";


// Match Header Component
const MatchHeader = ({ matchDetails, aiAnalysis }) => {
    if (!matchDetails) return null;

    const placeholderImg = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E8E8E8&color=6B7280&size=64`;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center flex flex-col items-center">
                    <img
                        src={matchDetails.team_home_badge || placeholderImg(matchDetails.match_hometeam_name)}
                        alt={`${matchDetails.match_hometeam_name} badge`}
                        className="w-12 h-12 md:w-16 md:h-16 mx-auto object-contain mb-2"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg(matchDetails.match_hometeam_name) }}
                    />
                    <h3 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2 leading-tight">
                        {matchDetails.match_hometeam_name}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">(Home)</div>
                </div>

                <AIOutcomePrediction aiAnalysis={aiAnalysis} matchDetails={matchDetails} />

                <div className="text-center flex flex-col items-center">
                    <img
                        src={matchDetails.team_away_badge || placeholderImg(matchDetails.match_awayteam_name)}
                        alt={`${matchDetails.match_awayteam_name} badge`}
                        className="w-12 h-12 md:w-16 md:h-16 mx-auto object-contain mb-2"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg(matchDetails.match_awayteam_name) }}
                    />
                    <h3 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2 leading-tight">
                        {matchDetails.match_awayteam_name}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">(Away)</div>
                </div>
            </div>
        </div>
    );
};

// Match Info Component
const MatchInfo = ({ matchDetails }) => {
    if (!matchDetails) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Match Information</h3>
            <div className="space-y-3">
                <div className="flex items-start space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                        <div className="text-xs text-gray-500">Date</div>
                        <div className="font-medium text-gray-900 text-sm">{matchDetails.match_date || 'N/A'}</div>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <Timer className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                        <div className="text-xs text-gray-500">Time (Local)</div>
                        <div className="font-medium text-gray-900 text-sm">{matchDetails.match_time || 'N/A'}</div>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <BarChart2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                        <div className="text-xs text-gray-500">Competition</div>
                        <div className="font-medium text-gray-900 text-sm">{matchDetails.league_name || 'N/A'}{matchDetails.country_name ? ` - ${matchDetails.country_name}` : ''}</div>
                    </div>
                </div>
                {matchDetails.match_stadium && matchDetails.match_stadium !== '-' && (
                    <div className="flex items-start space-x-3">
                        <Users className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                            <div className="text-xs text-gray-500">Venue</div>
                            <div className="font-medium text-gray-900 text-sm">{matchDetails.match_stadium}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Win Probabilities Component
const WinProbabilities = ({ predictions, matchDetails }) => {
    if (!predictions || !matchDetails) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Win Probabilities</h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{matchDetails.match_hometeam_name} Win</span>
                        <span className="font-semibold text-green-600">{parseFloat(predictions.prob_HW || 0).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${parseFloat(predictions.prob_HW || 0)}%` }}/>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span className="text-gray-700 font-medium">Draw</span>
                        <span className="font-semibold text-yellow-600">{parseFloat(predictions.prob_D || 0).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${parseFloat(predictions.prob_D || 0)}%` }} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{matchDetails.match_awayteam_name} Win</span>
                        <span className="font-semibold text-red-600">{parseFloat(predictions.prob_AW || 0).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${parseFloat(predictions.prob_AW || 0)}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Component
export default function MatchAnalysis({ params }) {
    const [matchDetails, setMatchDetails] = useState<any>(null);
    const [predictions, setPredictions] = useState<any>(null);
    const [aiAnalysis, setAIAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [aiLoading, setAILoading] = useState(false);
    const [aiError, setAIError] = useState<any>(null);

    const apiKey = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY;
    const deepseekKey = process.env.NEXT_PUBLIC_DEEPSEEK_KEY;

    useEffect(() => {
        const loadMatchData = async () => {
            setLoading(true);
            setError(null);
            setMatchDetails(null);
            setPredictions(null);
            setAIAnalysis(null);

            try {
                const resolvedParams = await params;
                const matchId = resolvedParams?.match;

                if (!matchId) throw new Error('Match ID missing');

                // Calculate dates for API query
                const today = new Date();
                const fromDate = new Date(today);
                fromDate.setDate(today.getDate() - 1);
                const toDate = new Date(today);
                toDate.setDate(today.getDate() + 1);

                // Fetch match data and predictions
                const { matchDetails, predictions } = await fetchMatchData(
                    matchId,
                    apiKey,
                    fromDate,
                    toDate
                );

                setMatchDetails(matchDetails);
                setPredictions(predictions);

                // Always get AI analysis if we have match details and predictions
                if (matchDetails && predictions) {
                    setAILoading(true);
                    // try {
                        const aiResult = await getAIAnalysis(matchDetails, predictions, deepseekKey);
                        console.log("AI Analysis Result:", aiResult);
                        setAIAnalysis(aiResult);
                    // } catch (aiErr) {
                    //     console.error('AI Analysis Error:', aiErr);
                    //     setAIError('Enhanced analysis temporarily unavailable');
                    // } finally {
                    //     setAILoading(false);
                    // }
                }
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err.message.includes('API key') ? 'Invalid API configuration' :
                    err.message.includes('not found') ? 'Match data not available' :
                        'Failed to load match data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadMatchData();
    }, [params, apiKey, deepseekKey]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"/>
            </div>
        );
    }

    if (!matchDetails && error) {
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-100px)] bg-gray-50 flex items-center justify-center px-4">
                    <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-red-600 mb-3">Could Not Load Match</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link href="/predictions" className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 font-semibold transition-colors">
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Predictions
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const showAIAnalysis = matchDetails && aiAnalysis;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Link href="/predictions" className="inline-flex items-center text-gray-600 hover:text-red-700 mb-6 text-sm font-medium group">
                    <ChevronLeft className="w-5 h-5 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Predictions
                </Link>

                {error && (
                    <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm shadow-sm">
                        <strong>Note:</strong> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Match Header with AI outcome prediction */}
                        {matchDetails && <MatchHeader matchDetails={matchDetails} aiAnalysis={aiAnalysis} />}

                        {/* AI Loading State */}
                        {/*{aiLoading && (*/}
                        {/*    <div className="bg-white p-6 rounded-xl">*/}
                        {/*        <div className="flex items-center justify-center gap-2 text-gray-500">*/}
                        {/*            <Loader2 className="animate-spin w-5 h-5" />*/}
                        {/*            Analyzing match patterns with AI...*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {/* AI Error State */}
                        {aiError && (
                            <div className="bg-white p-6 rounded-xl text-center text-yellow-700">
                                <AlertTriangle className="w-5 h-5 inline-block mr-2" />
                                {aiError}
                            </div>
                        )}

                        {/* AI Score and Key Predictions */}
                        {showAIAnalysis ? (
                            <>
                                <AIScorePrediction aiAnalysis={aiAnalysis} />
                                <AIKeyPredictions aiAnalysis={aiAnalysis} matchDetails={matchDetails} />


                            </>
                        ) : matchDetails && !aiLoading && (
                            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                                <p className="text-gray-500 mt-2">AI prediction analysis is currently unavailable for this match.</p>
                            </div>
                        )}

                        {/* AI Tactical Insights */}
                        {showAIAnalysis && <AITacticalInsights aiAnalysis={aiAnalysis} />}


                    </div>

                    <div className="space-y-6">
                        {/* Match Information */}
                        {matchDetails && <MatchInfo matchDetails={matchDetails} />}

                        {/* Original API Win Probabilities */}
                        {predictions && matchDetails && <WinProbabilities predictions={predictions} matchDetails={matchDetails} />}
                    </div>
                </div>
            </div>
        </div>
    );
}