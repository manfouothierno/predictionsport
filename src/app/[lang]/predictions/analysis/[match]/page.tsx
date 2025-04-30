'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Timer, ChevronLeft, BarChart2, Users, Percent, DollarSign, Goal, Scale, ChevronRight, ShieldCheck, HelpCircle, ThumbsDown, CheckCircle, XCircle } from 'lucide-react'; // Added CheckCircle, XCircle
import Link from "next/link";
import Navbar from "@/app/[lang]/langing/Navbar"; // Ensure correct path

// Helper function to get text likelihood (Yes/No/Maybe) based on percentage
const getLikelihoodTextYesNo = (percentage) => {
    const p = parseFloat(percentage) || 0;
    // Stricter threshold for a confident "Yes"
    if (p > 65) return { text: 'Yes', color: 'text-green-600', icon: CheckCircle };
    // Confident "No" for low probability
    if (p < 35) return { text: 'No', color: 'text-red-600', icon: XCircle };
    // Middle ground
    return { text: 'Maybe', color: 'text-yellow-600', icon: HelpCircle };
};


// Helper function to get confidence level text
const getConfidenceText = (percentage) => {
    const p = parseFloat(percentage) || 0;
    if (p > 80) return 'Very High Confidence';
    if (p > 65) return 'High Confidence';
    if (p > 50) return 'Medium Confidence';
    return 'Considered';
};


// Score Prediction Component (No changes needed here)
const ScorePrediction = ({ predictions }) => {
    const getHighestProbScore = () => {
        const overProb = parseFloat(predictions.prob_O) || 0;
        const underProb = parseFloat(predictions.prob_U) || 0;
        const homeWinProb = parseFloat(predictions.prob_HW) || 0;
        const awayWinProb = parseFloat(predictions.prob_AW) || 0;
        const drawProb = parseFloat(predictions.prob_D) || 0;
        const btsProb = parseFloat(predictions.prob_bts) || 0;

        // Try to be slightly more robust, prioritize stronger indicators
        if (homeWinProb > 75 && overProb > 70 && btsProb > 65) return { home: 2, away: 1, probability: Math.min(95, Math.floor(homeWinProb * 0.7 + overProb * 0.15 + btsProb * 0.15)) };
        if (homeWinProb > 75 && overProb > 70) return { home: 2, away: 0, probability: Math.min(95, Math.floor(homeWinProb * 0.8 + overProb * 0.2)) };
        if (homeWinProb > 70 && underProb > 60) return { home: 1, away: 0, probability: Math.min(95, Math.floor(homeWinProb * 0.8 + underProb * 0.2)) };

        if (awayWinProb > 75 && overProb > 70 && btsProb > 65) return { home: 1, away: 2, probability: Math.min(95, Math.floor(awayWinProb * 0.7 + overProb * 0.15 + btsProb * 0.15)) };
        if (awayWinProb > 75 && overProb > 70) return { home: 0, away: 2, probability: Math.min(95, Math.floor(awayWinProb * 0.8 + overProb * 0.2)) };
        if (awayWinProb > 70 && underProb > 60) return { home: 0, away: 1, probability: Math.min(95, Math.floor(awayWinProb * 0.8 + underProb * 0.2)) };

        if (drawProb > 50 && btsProb > 60) return { home: 1, away: 1, probability: Math.min(90, Math.floor(drawProb * 0.8 + btsProb * 0.2)) };
        if (drawProb > 50 && underProb > 60) return { home: 0, away: 0, probability: Math.min(90, Math.floor(drawProb * 0.8 + underProb * 0.2)) };

        // Less confident defaults
        if (homeWinProb > awayWinProb && homeWinProb > drawProb) return { home: 1, away: 0, probability: Math.floor(homeWinProb * 0.6) };
        if (awayWinProb > homeWinProb && awayWinProb > drawProb) return { home: 0, away: 1, probability: Math.floor(awayWinProb * 0.6) };

        return { home: 1, away: 1, probability: Math.floor(drawProb * 0.7) }; // Default draw if uncertain
    };

    const scorePrediction = getHighestProbScore();

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Most Likely Score Prediction</h3>
            <div className="text-center">
                <div className="inline-block bg-red-50 px-6 py-3 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">
                        {scorePrediction.home} - {scorePrediction.away}
                    </div>
                    {/* Optionally show derived probability, or remove if focusing away from percentages */}
                    <div className="text-sm text-gray-500 mt-1">
                        Model Confidence for this score: {scorePrediction.probability}%
                    </div>
                </div>
            </div>
        </div>
    );
};


// Betting Tips Component - Modified to show Yes/No tips for BTS
const BettingTips = ({ predictions, matchDetails }) => { // Pass matchDetails if needed for names
    const getTips = () => {
        const tips = [];
        const probO = parseFloat(predictions.prob_O) || 0;
        const probHW = parseFloat(predictions.prob_HW) || 0;
        const probAW = parseFloat(predictions.prob_AW) || 0;
        const probBTS = parseFloat(predictions.prob_bts) || 0;
        const probU = parseFloat(predictions.prob_U) || 0;

        // Over/Under Tips (still based on high probability threshold)
        if (probO > 70) {
            tips.push({
                tip: "Over 2.5 Goals",
                confidence: probO,
                reasoning: "High probability of 3+ goals.",
                icon: Goal,
                likelihoodText: getLikelihoodTextYesNo(probO).text // Get Yes/Maybe
            });
        } else if (probU > 70) {
            tips.push({
                tip: "Under 2.5 Goals",
                confidence: probU,
                reasoning: "High probability of fewer than 3 goals.",
                icon: Scale, // Using Scale icon for balance/under
                likelihoodText: getLikelihoodTextYesNo(100-probU).text // 'No' for over -> yes for under
            });
        }

        // Win probability tips (still based on high probability threshold)
        if (probHW > 75) {
            tips.push({
                tip: `${matchDetails?.match_hometeam_name || 'Home'} to Win`, // Use matchDetails
                confidence: probHW,
                reasoning: "Strong home team advantage indicated.",
                icon: TrendingUp,
                likelihoodText: getLikelihoodTextYesNo(probHW).text // Get Yes
            });
        } else if (probAW > 75) {
            tips.push({
                tip: `${matchDetails?.match_awayteam_name || 'Away'} to Win`, // Use matchDetails
                confidence: probAW,
                reasoning: "Strong away team performance expected.",
                icon: TrendingUp,
                likelihoodText: getLikelihoodTextYesNo(probAW).text // Get Yes
            });
        }

        // Both teams to score Tip using Yes/No
        const btsLikelihood = getLikelihoodTextYesNo(probBTS);
        // Only add a tip if the prediction is strong Yes or No
        if (btsLikelihood.text === 'Yes') {
            tips.push({
                tip: "Both Teams to Score: Yes",
                confidence: probBTS, // The probability supports 'Yes'
                reasoning: "Both teams likely find the net.",
                icon: CheckCircle, // Use specific Yes icon
                likelihoodText: "Yes"
            });
        } else if (btsLikelihood.text === 'No') {
            tips.push({
                tip: "Both Teams to Score: No",
                // Confidence reflects probability supporting 'No'
                confidence: 100 - probBTS, // Probability of NOT scoring
                reasoning: "One or both teams likely to keep a clean sheet.",
                icon: XCircle, // Use specific No icon
                likelihoodText: "No"
            });
        }

        // Optional: Sort by confidence or relevance before slicing if needed
        // tips.sort((a, b) => b.confidence - a.confidence);
        // return tips.slice(0, 3); // Example: show top 3 tips

        return tips;
    };

    const displayedTips = getTips();

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Key Betting Tips</h3>
            {displayedTips.length === 0 ? (
                <p className="text-sm text-gray-500">No strong Yes/No betting tips identified for this match.</p>
            ) : (
                <div className="space-y-4">
                    {displayedTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                                {/* Use the icon directly associated with the Yes/No/Market */}
                                <tip.icon className={`h-5 w-5 ${getLikelihoodTextYesNo(tip.confidence).color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{tip.tip}</div>
                                <div className="text-sm text-gray-500">{tip.reasoning}</div>
                                <div className="mt-2">
                                    {/* Display confidence text and likelihood (Yes/No/Maybe) */}
                                    <div className={`text-xs font-semibold ${getLikelihoodTextYesNo(tip.confidence).color}`}>
                                        {/* Show 'Yes' or 'No' prominently for BTS */}
                                        {tip.tip.includes("Both Teams") ?
                                            <span className="font-bold">{tip.likelihoodText}</span>
                                            :
                                            // For other markets, show confidence text
                                            getConfidenceText(tip.confidence)
                                        }
                                        {/* Keep numeric % for context */}
                                        ({tip.confidence.toFixed(0)}%)
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Detailed Analysis Component - Use Yes/No/Maybe for BTS and Over/Under
const DetailedAnalysis = ({ predictions, matchDetails }) => {
    // Use the new helper function
    const overLikelihood = getLikelihoodTextYesNo(predictions.prob_O);
    const btsLikelihood = getLikelihoodTextYesNo(predictions.prob_bts);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Detailed Match Analysis</h3>
            <div className="space-y-6">
                {/* Team Formations - Check if data exists */}
                {(matchDetails.match_hometeam_system && matchDetails.match_hometeam_system !== '-' && matchDetails.match_awayteam_system && matchDetails.match_awayteam_system !== '-') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <div className="text-sm text-gray-500">Home Formation</div>
                            <div className="text-lg font-semibold text-gray-900">{matchDetails.match_hometeam_system}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <div className="text-sm text-gray-500">Away Formation</div>
                            <div className="text-lg font-semibold text-gray-900">{matchDetails.match_awayteam_system}</div>
                        </div>
                    </div>
                )}

                {/* Goal / BTS Probabilities - Using Yes/No/Maybe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                        {/* Use the icon from the helper */}
                        <overLikelihood.icon className={`w-6 h-6 ${overLikelihood.color}`} />
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Over 2.5 Goals</div>
                            {/* Use the text (Yes/No/Maybe) */}
                            <div className={`text-lg font-semibold ${overLikelihood.color}`}>{overLikelihood.text}</div>
                            <div className="text-xs text-gray-400">({predictions.prob_O}%)</div> {/* Keep % small */}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                        {/* Use the icon from the helper */}
                        <btsLikelihood.icon className={`w-6 h-6 ${btsLikelihood.color}`} />
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Both Teams to Score</div>
                            {/* Use the text (Yes/No/Maybe) */}
                            <div className={`text-lg font-semibold ${btsLikelihood.color}`}>{btsLikelihood.text}</div>
                            <div className="text-xs text-gray-400">({predictions.prob_bts}%)</div> {/* Keep % small */}
                        </div>
                    </div>
                </div>

                {/* Asian Handicap Analysis (Remains the same) */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Asian Handicap Probability (Home Team)</h4>
                    <div className="space-y-3">
                        {[ // Simplified AH lines for example
                            { label: "-0.5", home: predictions.prob_ah_h_05 || 'N/A' },
                            { label: "-1.5", home: predictions.prob_ah_h_15 || 'N/A' },
                        ].filter(h => h.home !== 'N/A' && h.home !== "").map((handicap, index) => ( // Filter out invalid before mapping
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Home {handicap.label}</span>
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
                        { ![predictions.prob_ah_h_05, predictions.prob_ah_h_15].some(p => p && p !== 'N/A' && p !== "") && // Check if ANY valid AH data exists
                            <p className="text-sm text-gray-400 text-center">Asian Handicap data not available.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

// Match Header Component (No changes needed here)
const MatchHeader = ({ matchDetails, predictions }) => {
    const getPredictionOutcome = () => {
        const homeProb = parseFloat(predictions.prob_HW) || 0;
        const awayProb = parseFloat(predictions.prob_AW) || 0;
        const drawProb = parseFloat(predictions.prob_D) || 0;

        // Prioritize strongest probability
        if (homeProb > 65 && homeProb > awayProb && homeProb > drawProb) return `${matchDetails.match_hometeam_name} Win Likely`;
        if (awayProb > 65 && awayProb > homeProb && awayProb > drawProb) return `${matchDetails.match_awayteam_name} Win Likely`;
        if (drawProb > 50 && drawProb > homeProb && drawProb > awayProb) return 'Draw Likely'; // Draw needs lower threshold?

        // Less certain outcomes
        if (homeProb > awayProb && homeProb > drawProb) return `${matchDetails.match_hometeam_name} Favoured`;
        if (awayProb > homeProb && awayProb > drawProb) return `${matchDetails.match_awayteam_name} Favoured`;
        if (drawProb > 35) return 'Draw Possible'; // If draw isn't lowest, but not highest >50

        return 'Prediction Unclear'; // Fallback if probabilities are very low/close
    };


    const placeholderImg = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E8E8E8&color=6B7280&size=64`;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                    <img
                        src={matchDetails.team_home_badge || placeholderImg(matchDetails.match_hometeam_name)}
                        alt={`${matchDetails.match_hometeam_name} badge`}
                        className="w-12 h-12 md:w-16 md:h-16 mx-auto object-contain mb-2"
                        onError={(e) => { e.target.onerror = null; e.target.src=placeholderImg(matchDetails.match_hometeam_name) }}
                    />
                    <h3 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
                        {matchDetails.match_hometeam_name}
                    </h3>
                    <div className="text-xs text-gray-500">(Home)</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">Predicted Outcome</div> {/* Changed text */}
                    <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-medium text-xs md:text-sm">
                        {getPredictionOutcome()}
                    </div>
                    <div className="text-xs text-gray-400 mt-3 truncate hidden md:block">{matchDetails.league_name}</div>
                </div>
                <div className="text-center">
                    <img
                        src={matchDetails.team_away_badge || placeholderImg(matchDetails.match_awayteam_name)}
                        alt={`${matchDetails.match_awayteam_name} badge`}
                        className="w-12 h-12 md:w-16 md:h-16 mx-auto object-contain mb-2"
                        onError={(e) => { e.target.onerror = null; e.target.src=placeholderImg(matchDetails.match_awayteam_name) }}
                    />
                    <h3 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
                        {matchDetails.match_awayteam_name}
                    </h3>
                    <div className="text-xs text-gray-500">(Away)</div>
                </div>
            </div>
        </div>
    );
};

// Main Component (No changes needed here for functionality, added missing matchDetails prop to BettingTips call)
export default function MatchAnalysis({ params }) {
    const [matchDetails, setMatchDetails] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiKey] = useState("a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004"); // Replace with your actual API key or use environment variables

    useEffect(() => {
        // Make sure API Key is set
        if (apiKey === "YOUR_API_FOOTBALL_API_KEY") {
            console.error("API Key is not set!");
            setError("API Key is missing. Please configure it in the component.");
            setLoading(false);
            return;
        }

        const fetchMatchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const resolvedParams = await params;
                const matchId = resolvedParams?.match;

                if (!matchId) {
                    throw new Error('Match ID is missing.');
                }

                const today = new Date();
                const fromDate = new Date(today);
                fromDate.setDate(today.getDate() - 1);
                const toDate = new Date(today);
                toDate.setDate(today.getDate() + 2);

                const fromStr = fromDate.toISOString().split('T')[0];
                const toStr = toDate.toISOString().split('T')[0];

                const [matchResponse, predictionResponse] = await Promise.all([
                    fetch(`https://apiv3.apifootball.com/?action=get_events&APIkey=${apiKey}&from=${fromStr}&to=${toStr}&match_id=${matchId}`),
                    fetch(`https://apiv3.apifootball.com/?action=get_predictions&APIkey=${apiKey}&from=${fromStr}&to=${toStr}&match_id=${matchId}`)
                ]);

                if (!matchResponse.ok || !predictionResponse.ok) {
                    console.error("API Response Error:", matchResponse.status, predictionResponse.status);
                    // Try parsing error body if possible
                    let errorMsg = `Failed to fetch data from API (Status: ${matchResponse.status}/${predictionResponse.status})`;
                    try {
                        if (!matchResponse.ok) errorMsg = (await matchResponse.json())?.message || errorMsg;
                        if (!predictionResponse.ok) errorMsg = (await predictionResponse.json())?.message || errorMsg;
                    } catch (e) { /* Ignore parsing error */ }

                    throw new Error(errorMsg);
                }

                const matchData = await matchResponse.json();
                const predictionData = await predictionResponse.json();

                if (matchData.error || !Array.isArray(matchData) || matchData.length === 0) {
                    console.error("Match Data Error:", matchData);
                    throw new Error(matchData.message || 'Match details not found or API error.');
                }
                if (predictionData.error || !Array.isArray(predictionData) || predictionData.length === 0) {
                    console.error("Prediction Data Error:", predictionData);
                    // Provide more context if predictions are missing but match is found
                    setMatchDetails(matchData[0]); // Still set match details if available
                    throw new Error(predictionData.message || 'Prediction data not found for this match.');
                }

                setMatchDetails(matchData[0]);
                setPredictions(predictionData[0]);

            } catch (err) {
                console.error('Error fetching match data:', err);
                setError(err.message || 'Failed to load match data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMatchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, apiKey]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"/>
            </div>
        );
    }

    // Adjusted Error/No Data Display
    if (error || (!matchDetails && !loading)) { // Check if matchDetails is null *after* loading
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-100px)] bg-gray-50 flex items-center justify-center px-4">
                    <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-red-600 mb-3">Error Loading Match Data</h2>
                        {/* Display specific error message */}
                        <p className="text-gray-600 mb-6">{error || 'Match details could not be found. The match might be outdated or the ID might be incorrect.'}</p>
                        <Link href="/predictions" className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 font-semibold transition-colors">
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Predictions
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // Added check for missing predictions even if matchDetails exists
    const showPredictions = matchDetails && predictions;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Link href="/predictions" className="inline-flex items-center text-gray-600 hover:text-red-700 mb-6 text-sm font-medium group">
                    <ChevronLeft className="w-5 h-5 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Predictions
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Conditionally render prediction-based components */}
                        {showPredictions ? (
                            <>
                                <MatchHeader matchDetails={matchDetails} predictions={predictions} />
                                <ScorePrediction predictions={predictions} />
                                <DetailedAnalysis predictions={predictions} matchDetails={matchDetails} />
                            </>
                        ) : matchDetails ? ( // Show limited info if only match details loaded
                            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                                <h3 className="font-semibold text-gray-800 text-lg">{matchDetails.match_hometeam_name} vs {matchDetails.match_awayteam_name}</h3>
                                <p className="text-gray-500 mt-2">Prediction data is not yet available for this match.</p>
                            </div>
                        ) : null /* Should be caught by error handler */ }
                    </div>

                    <div className="space-y-6">
                        {/* Always show Match Info if matchDetails exist */}
                        {matchDetails && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Match Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Date</div>
                                            <div className="font-medium text-gray-900">{matchDetails.match_date || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Timer className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Time (Local)</div>
                                            <div className="font-medium text-gray-900">{matchDetails.match_time || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <BarChart2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Competition</div>
                                            <div className="font-medium text-gray-900">{matchDetails.league_name || 'N/A'} - {matchDetails.country_name || ''}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Conditionally render prediction-based sidebar widgets */}
                        {showPredictions && (
                            <>
                                <BettingTips predictions={predictions} matchDetails={matchDetails} />

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Win Probabilities</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{matchDetails.match_hometeam_name} Win</span>
                                                <span className="font-semibold text-green-600">{predictions.prob_HW}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${predictions.prob_HW}%` }}/>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                                <span className="text-gray-700 font-medium">Draw</span>
                                                <span className="font-semibold text-yellow-600">{predictions.prob_D}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${predictions.prob_D}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{matchDetails.match_awayteam_name} Win</span>
                                                <span className="font-semibold text-red-600">{predictions.prob_AW}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-red-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${predictions.prob_AW}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="sticky bottom-4 space-y-3 px-1 py-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 lg:shadow-none lg:bg-transparent lg:border-none lg:sticky-none lg:p-0">
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 font-semibold flex items-center justify-center space-x-2 transition-colors text-sm md:text-base">
                                        <span>View Betting Odds</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}