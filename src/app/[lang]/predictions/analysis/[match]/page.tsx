'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Timer, ChevronLeft, BarChart2, CheckCircle, XCircle, Scale, ChevronRight, Goal, Users, DollarSign } from 'lucide-react';
import Link from "next/link";
import Navbar from "@/app/[lang]/langing/Navbar"; // Adjust this path if your Navbar is located elsewhere

// Helper function to get Yes/No prediction based on percentage and threshold
const getPredictionYesNo = (percentage, threshold = 50) => {
    const p = parseFloat(percentage) || 0;
    if (p > threshold) {
        return { text: 'Yes', color: 'text-green-600', icon: CheckCircle };
    } else {
        return { text: 'No', color: 'text-red-600', icon: XCircle };
    }
};

// Extracted function to calculate the most likely score
const calculateHighestProbScore = (predictions) => {
    if (!predictions) return { home: 0, away: 0, probability: 15 }; // Default if no predictions

    const overProb = parseFloat(predictions.prob_O) || 0;
    const underProb = 100 - overProb; // Usually 100 - overProb, reliable source
    const homeWinProb = parseFloat(predictions.prob_HW) || 0;
    const awayWinProb = parseFloat(predictions.prob_AW) || 0;
    const drawProb = parseFloat(predictions.prob_D) || 0;
    const btsProb = parseFloat(predictions.prob_bts) || 0;
    const ntsProb = 100 - btsProb; // No Team to Score probability

    // Define potential scores and their rough conditions based on probabilities
    const potentialScores = [];

    // --- Scores favoring Home Win ---
    // 1-0 (HW > AW/D, Under likely, NTS likely)
    if (homeWinProb > drawProb && homeWinProb > awayWinProb) {
        potentialScores.push({ home: 1, away: 0, probability: Math.floor(homeWinProb * 0.5 + underProb * 0.3 + ntsProb * 0.2) });
        // 2-0 (HW strong, Over possible, NTS needed)
        if (homeWinProb > 65 && overProb > 40) {
            potentialScores.push({ home: 2, away: 0, probability: Math.floor(homeWinProb * 0.6 + overProb * 0.2 + ntsProb * 0.2) });
        }
        // 2-1 (HW strong, Over likely, BTS likely)
        if (homeWinProb > 60 && overProb > 50 && btsProb > 50) {
            potentialScores.push({ home: 2, away: 1, probability: Math.floor(homeWinProb * 0.5 + overProb * 0.25 + btsProb * 0.25) });
        }
        // 3-1 (HW very strong, Over likely, BTS likely)
        if (homeWinProb > 70 && overProb > 60 && btsProb > 55) {
            potentialScores.push({ home: 3, away: 1, probability: Math.floor(homeWinProb * 0.4 + overProb * 0.3 + btsProb * 0.3) });
        }
        // 3-0 (HW very strong, Over likely, NTS possible)
        if (homeWinProb > 75 && overProb > 55 && ntsProb > 40) {
            potentialScores.push({ home: 3, away: 0, probability: Math.floor(homeWinProb * 0.5 + overProb * 0.3 + ntsProb * 0.2) });
        }
    }

    // --- Scores favoring Away Win ---
    // 0-1 (AW > HW/D, Under likely, NTS likely)
    if (awayWinProb > drawProb && awayWinProb > homeWinProb) {
        potentialScores.push({ home: 0, away: 1, probability: Math.floor(awayWinProb * 0.5 + underProb * 0.3 + ntsProb * 0.2) });
        // 0-2 (AW strong, Over possible, NTS needed)
        if (awayWinProb > 65 && overProb > 40) {
            potentialScores.push({ home: 0, away: 2, probability: Math.floor(awayWinProb * 0.6 + overProb * 0.2 + ntsProb * 0.2) });
        }
        // 1-2 (AW strong, Over likely, BTS likely)
        if (awayWinProb > 60 && overProb > 50 && btsProb > 50) {
            potentialScores.push({ home: 1, away: 2, probability: Math.floor(awayWinProb * 0.5 + overProb * 0.25 + btsProb * 0.25) });
        }
        // 1-3 (AW very strong, Over likely, BTS likely)
        if (awayWinProb > 70 && overProb > 60 && btsProb > 55) {
            potentialScores.push({ home: 1, away: 3, probability: Math.floor(awayWinProb * 0.4 + overProb * 0.3 + btsProb * 0.3) });
        }
        // 0-3 (AW very strong, Over likely, NTS possible)
        if (awayWinProb > 75 && overProb > 55 && ntsProb > 40) {
            potentialScores.push({ home: 0, away: 3, probability: Math.floor(awayWinProb * 0.5 + overProb * 0.3 + ntsProb * 0.2) });
        }
    }

    // --- Scores favoring Draw ---
    // 0-0 (Draw likely, Under strong, NTS strong)
    if (drawProb > 30 && underProb > 55 && ntsProb > 55) { // Requires strong signals for 0-0
        potentialScores.push({ home: 0, away: 0, probability: Math.floor(drawProb * 0.5 + underProb * 0.3 + ntsProb * 0.2) });
    }
    // 1-1 (Draw likely, BTS likely)
    if (drawProb > 30 && btsProb > 55) { // Requires strong signal for BTS 1-1
        potentialScores.push({ home: 1, away: 1, probability: Math.floor(drawProb * 0.5 + btsProb * 0.4 + (overProb > 50 ? 5 : 0)) }); // Slightly boost if Over likely too
    }
    // 2-2 (Draw possible, Over strong, BTS strong)
    if (drawProb > 25 && overProb > 65 && btsProb > 65) {
        potentialScores.push({ home: 2, away: 2, probability: Math.floor(drawProb * 0.4 + overProb * 0.3 + btsProb * 0.3) });
    }

    // --- Fallback Mechanism ---
    if (potentialScores.length === 0) {
        // Simplified fallback based purely on win/draw/lose and BTS/NTS
        if (homeWinProb >= awayWinProb && homeWinProb >= drawProb) {
            potentialScores.push(btsProb > 50 ? { home: 2, away: 1 } : { home: 1, away: 0 });
        } else if (awayWinProb > homeWinProb && awayWinProb >= drawProb) {
            potentialScores.push(btsProb > 50 ? { home: 1, away: 2 } : { home: 0, away: 1 });
        } else { // Draw is most likely
            potentialScores.push(btsProb > 50 ? { home: 1, away: 1 } : { home: 0, away: 0 });
        }
        // Assign a generic confidence for fallbacks
        const fallbackProb = Math.max(homeWinProb, awayWinProb, drawProb);
        potentialScores[potentialScores.length-1].probability = Math.max(15, Math.floor(fallbackProb * 0.6));
    } else {
        // Ensure probability is assigned and normalized
        potentialScores.forEach(score => {
            if (score.probability === undefined) {
                score.probability = Math.max(15, Math.floor(Math.max(homeWinProb, awayWinProb, drawProb) * 0.5));
            }
            // Ensure probability is at least 15% and cap reasonably (e.g., 95%)
            score.probability = Math.max(15, Math.min(95, score.probability));
        });
    }

    // Sort potential scores by calculated probability (descending)
    potentialScores.sort((a, b) => b.probability - a.probability);

    // Return the score with the highest calculated probability
    return potentialScores[0];
};


// Score Prediction Component - Uses the calculated score passed via prop
const ScorePrediction = ({ scorePredictionResult }) => {
    const scorePrediction = scorePredictionResult || { home: '?', away: '?', probability: 0 };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Most Likely Score Prediction</h3>
            <div className="text-center">
                <div className="inline-block bg-red-50 px-6 py-3 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">
                        {scorePrediction.home} - {scorePrediction.away}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        Model Confidence: {scorePrediction.probability}%
                    </div>
                </div>
            </div>
        </div>
    );
};


// Betting Tips Component - Based on raw probabilities > threshold
const BettingTips = ({ predictions, matchDetails }) => {
    if (!predictions) return null; // Don't render if no prediction data

    const threshold = 50; // Define the threshold for 'Yes'

    const getTips = () => {
        const tips = [];
        const probO = parseFloat(predictions.prob_O) || 0;
        const probU = 100 - probO; // Calculate Under probability
        const probHW = parseFloat(predictions.prob_HW) || 0;
        const probAW = parseFloat(predictions.prob_AW) || 0;
        const probD = parseFloat(predictions.prob_D) || 0; // Draw probability
        const probBTS = parseFloat(predictions.prob_bts) || 0;
        const probNTS = 100 - probBTS; // Probability of Not Both Teams Scoring

        // Over/Under Tips
        if (probO > threshold) {
            tips.push({
                tip: "Over 2.5 Goals: Yes",
                probability: probO,
                prediction: getPredictionYesNo(probO, threshold),
                icon: Goal,
            });
        }
        if (probU > threshold) {
            tips.push({
                tip: "Under 2.5 Goals: Yes",
                probability: probU,
                prediction: getPredictionYesNo(probU, threshold),
                icon: Scale,
            });
        }

        // Win/Draw probability tips
        if (probHW > threshold) {
            tips.push({
                tip: `${matchDetails?.match_hometeam_name || 'Home'} to Win: Yes`,
                probability: probHW,
                prediction: getPredictionYesNo(probHW, threshold),
                icon: TrendingUp,
            });
        }
        if (probAW > threshold) {
            tips.push({
                tip: `${matchDetails?.match_awayteam_name || 'Away'} to Win: Yes`,
                probability: probAW,
                prediction: getPredictionYesNo(probAW, threshold),
                icon: TrendingUp, // Could use a different icon for away?
            });
        }
        if (probD > threshold) {
            tips.push({
                tip: `Draw: Yes`,
                probability: probD,
                prediction: getPredictionYesNo(probD, threshold),
                icon: Scale, // Icon representing balance/draw
            });
        }

        // Both teams to score Tip
        if (probBTS > threshold) {
            tips.push({
                tip: "Both Teams to Score: Yes",
                probability: probBTS,
                prediction: getPredictionYesNo(probBTS, threshold),
                icon: Goal,
            });
        }
        if (probNTS > threshold) {
            tips.push({
                tip: "Both Teams to Score: No",
                probability: probNTS,
                prediction: getPredictionYesNo(0, threshold), // Force 'No' appearance
                icon: XCircle,
            });
        }

        // Prioritize tips with higher probability
        tips.sort((a, b) => b.probability - a.probability);
        return tips.slice(0, 4); // Limit to top 4 strongest tips
    };

    const displayedTips = getTips();

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Prediction Insights (>{threshold}% Probability)</h3>
            {displayedTips.length === 0 ? (
                <p className="text-sm text-gray-500">No predictions met the >{threshold}% confidence threshold.</p>
            ) : (
                <div className="space-y-4">
                    {displayedTips.map((tip, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <tip.prediction.icon className={`h-5 w-5 ${tip.prediction.color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">{tip.tip}</div>
                                <div className={`text-xs font-semibold ${tip.prediction.color}`}>
                                    Probability: {tip.probability.toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// Detailed Analysis Component - BTS Yes/No is derived from the PREDICTED SCORE
const DetailedAnalysis = ({ predictions, matchDetails, scorePredictionResult }) => {
    if (!predictions || !matchDetails) return null; // Need base data

    const threshold = 50; // Threshold for Over/Under and Win predictions
    const probO = parseFloat(predictions.prob_O || 0);
    const probHW = parseFloat(predictions.prob_HW || 0);
    const probAW = parseFloat(predictions.prob_AW || 0);
    const btsRawProbability = parseFloat(predictions.prob_bts || 0);

    const overPrediction = getPredictionYesNo(probO, threshold);
    const homeWinPred = getPredictionYesNo(probHW, threshold);
    const awayWinPred = getPredictionYesNo(probAW, threshold);

    // --- BTS Logic: Derive Yes/No from the predicted score ---
    let btsDisplayPrediction;
    if (scorePredictionResult && scorePredictionResult.home > 0 && scorePredictionResult.away > 0) {
        btsDisplayPrediction = { text: 'Yes', color: 'text-green-600', icon: CheckCircle };
    } else if (scorePredictionResult) {
        btsDisplayPrediction = { text: 'No', color: 'text-red-600', icon: XCircle };
    } else {
        // Fallback if score prediction isn't available: use raw probability
        btsDisplayPrediction = getPredictionYesNo(btsRawProbability, threshold);
    }
    // --- End BTS Logic ---

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Market Predictions (Derived & >{threshold}% Threshold)</h3>
            <div className="space-y-6">
                {/* Team Formations (Optional Display) */}
                {(matchDetails.match_hometeam_system && matchDetails.match_hometeam_system !== '-' && matchDetails.match_awayteam_system && matchDetails.match_awayteam_system !== '-') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs text-gray-500">Home Formation</div>
                            <div className="text-base font-semibold text-gray-900">{matchDetails.match_hometeam_system}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs text-gray-500">Away Formation</div>
                            <div className="text-base font-semibold text-gray-900">{matchDetails.match_awayteam_system}</div>
                        </div>
                    </div>
                )}

                {/* Goal / BTS Predictions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Over 2.5 Goals? - Based on raw prob > threshold */}
                    <div className="p-4 bg-gray-50 rounded-lg flex items-start space-x-3">
                        <overPrediction.icon className={`w-6 h-6 ${overPrediction.color} flex-shrink-0 mt-1`} />
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Over 2.5 Goals?</div>
                            <div className={`text-lg font-semibold ${overPrediction.color}`}>{overPrediction.text}</div>
                            <div className="text-xs text-gray-400">({probO.toFixed(2)}%)</div>
                        </div>
                    </div>
                    {/* Both Teams to Score? - Based on SCORE PREDICTION */}
                    <div className="p-4 bg-gray-50 rounded-lg flex items-start space-x-3">
                        <btsDisplayPrediction.icon className={`w-6 h-6 ${btsDisplayPrediction.color} flex-shrink-0 mt-1`} />
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Both Teams to Score?</div>
                            <div className={`text-lg font-semibold ${btsDisplayPrediction.color}`}>{btsDisplayPrediction.text}</div>
                            <div className="text-xs text-gray-400">(Model Prob: {btsRawProbability.toFixed(2)}%)</div>
                        </div>
                    </div>
                </div>

                {/* Win Prediction Simplified - Based on raw prob > threshold */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-start space-x-3">
                        <homeWinPred.icon className={`w-6 h-6 ${homeWinPred.color} flex-shrink-0 mt-1`} />
                        <div>
                            <div className="text-sm text-gray-500 mb-1">{matchDetails.match_hometeam_name} to Win?</div>
                            <div className={`text-lg font-semibold ${homeWinPred.color}`}>{homeWinPred.text}</div>
                            <div className="text-xs text-gray-400">({probHW.toFixed(2)}%)</div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-start space-x-3">
                        <awayWinPred.icon className={`w-6 h-6 ${awayWinPred.color} flex-shrink-0 mt-1`} />
                        <div>
                            <div className="text-sm text-gray-500 mb-1">{matchDetails.match_awayteam_name} to Win?</div>
                            <div className={`text-lg font-semibold ${awayWinPred.color}`}>{awayWinPred.text}</div>
                            <div className="text-xs text-gray-400">({probAW.toFixed(2)}%)</div>
                        </div>
                    </div>
                </div>

                {/* Asian Handicap Analysis */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Asian Handicap Probability (Home Team)</h4>
                    <div className="space-y-3">
                        {[ // Filter and map valid entries
                            { label: "-0.5", home: predictions.prob_ah_h_05 || 'N/A' },
                            { label: "-1.5", home: predictions.prob_ah_h_15 || 'N/A' },
                            // Add more handicaps if available in your API response
                            // { label: "+0.5", home: predictions.prob_ah_h_p05 || 'N/A' },
                        ]
                            .filter(h => h.home !== 'N/A' && h.home !== "" && !isNaN(parseFloat(h.home)) && parseFloat(h.home) >= 0) // Check valid number
                            .map((handicap, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Home {handicap.label}</span>
                                        <span>{parseFloat(handicap.home).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-500" // Changed color for distinction
                                            style={{ width: `${parseFloat(handicap.home).toFixed(0)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        {/* Message if no valid AH data */}
                        { ![predictions.prob_ah_h_05, predictions.prob_ah_h_15].some(p => p && p !== 'N/A' && p !== "" && !isNaN(parseFloat(p)) && parseFloat(p) >= 0) &&
                            <p className="text-xs text-gray-400 text-center py-2">Asian Handicap data not available or probabilities are 0.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};


// Match Header Component - Simplified Prediction Outcome Text
const MatchHeader = ({ matchDetails, predictions }) => {
    if (!matchDetails) return null; // Need details to render

    const getPredictionOutcomeText = () => {
        // Handle case where predictions might be null/empty initially
        if (!predictions || Object.keys(predictions).length === 0) return 'Prediction Pending...';

        const homeProb = parseFloat(predictions.prob_HW) || 0;
        const awayProb = parseFloat(predictions.prob_AW) || 0;
        const drawProb = parseFloat(predictions.prob_D) || 0;

        const maxProb = Math.max(homeProb, awayProb, drawProb);

        // Handle cases where probabilities might be zero or equal
        if (maxProb === 0) return 'Uncertain';
        if (maxProb === homeProb && maxProb > awayProb && maxProb > drawProb) return `${matchDetails.match_hometeam_name} Win`;
        if (maxProb === awayProb && maxProb > homeProb && maxProb > drawProb) return `${matchDetails.match_awayteam_name} Win`;
        if (maxProb === drawProb) return 'Draw';

        // Fallback for unusual equal probability scenarios
        if (homeProb === awayProb) return 'Draw or Home/Away';
        return 'Draw'; // Default fallback
    };

    const placeholderImg = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E8E8E8&color=6B7280&size=64`;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-3 gap-4 items-center">
                {/* Home Team */}
                <div className="text-center flex flex-col items-center">
                    <img
                        src={matchDetails.team_home_badge || placeholderImg(matchDetails.match_hometeam_name)}
                        alt={`${matchDetails.match_hometeam_name} badge`}
                        className="w-12 h-12 md:w-16 md:h-16 mx-auto object-contain mb-2"
                        onError={(e) => { e.target.onerror = null; e.target.src=placeholderImg(matchDetails.match_hometeam_name) }}
                    />
                    <h3 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2 leading-tight">
                        {matchDetails.match_hometeam_name}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">(Home)</div>
                </div>

                {/* Prediction Outcome */}
                <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">Most Likely Result</div>
                    <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-medium text-xs md:text-sm min-h-[40px] flex items-center justify-center">
                        {getPredictionOutcomeText()}
                    </div>
                    <div className="text-xs text-gray-400 mt-3 truncate hidden md:block">
                        {matchDetails.league_name}{matchDetails.country_name ? ` - ${matchDetails.country_name}` : ''}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate md:hidden"> {/* League name for mobile */}
                        {matchDetails.league_name}
                    </div>
                </div>

                {/* Away Team */}
                <div className="text-center flex flex-col items-center">
                    <img
                        src={matchDetails.team_away_badge || placeholderImg(matchDetails.match_awayteam_name)}
                        alt={`${matchDetails.match_awayteam_name} badge`}
                        className="w-12 h-12 md:w-16 md:h-16 mx-auto object-contain mb-2"
                        onError={(e) => { e.target.onerror = null; e.target.src=placeholderImg(matchDetails.match_awayteam_name) }}
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


// Main Component
export default function MatchAnalysis({ params }) {
    const [matchDetails, setMatchDetails] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scorePredictionResult, setScorePredictionResult] = useState(null);

    // IMPORTANT: Replace with your actual API key securely (e.g., environment variable)
    // It's recommended to use environment variables: process.env.NEXT_PUBLIC_API_FOOTBALL_KEY
    const [apiKey] = useState(process.env.NEXT_PUBLIC_API_FOOTBALL_KEY || "a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004"); // Replace YOUR_API_FOOTBALL_API_KEY with your actual key if not using env vars

    useEffect(() => {
        // Basic API Key check
        if (!apiKey || apiKey === "YOUR_API_FOOTBALL_API_KEY") {
            console.error("API Key is not set or is using the placeholder!");
            setError("API Key is missing or invalid. Please configure it.");
            setLoading(false);
            return;
        }

        const fetchMatchData = async () => {
            setLoading(true);
            setError(null);
            setMatchDetails(null);
            setPredictions(null);
            setScorePredictionResult(null); // Reset score prediction

            try {
                // Await params resolution if it's a promise (common in Next.js app router)
                const resolvedParams = await params;
                const matchId = resolvedParams?.match;

                if (!matchId) {
                    throw new Error('Match ID is missing from the URL parameters.');
                }

                // Define date range for API calls (adjust as needed, +/- 1 day is usually safe)
                const today = new Date();
                const fromDate = new Date(today);
                fromDate.setDate(today.getDate() - 1); // From yesterday
                const toDate = new Date(today);
                toDate.setDate(today.getDate() + 1); // To tomorrow

                const fromStr = fromDate.toISOString().split('T')[0];
                const toStr = toDate.toISOString().split('T')[0];

                console.log(`Fetching data for match ID: ${matchId}, Date Range: ${fromStr} to ${toStr}`);

                // Fetch match details and predictions concurrently
                const [matchResponse, predictionResponse] = await Promise.all([
                    fetch(`https://apiv3.apifootball.com/?action=get_events&APIkey=${apiKey}&from=${fromStr}&to=${toStr}&match_id=${matchId}`),
                    fetch(`https://apiv3.apifootball.com/?action=get_predictions&APIkey=${apiKey}&from=${fromStr}&to=${toStr}&match_id=${matchId}`)
                ]);

                // --- Process Match Details ---
                if (!matchResponse.ok) {
                    console.error("Match API Response Error:", matchResponse.status, await matchResponse.text());
                    throw new Error(`Failed to fetch match details (Status: ${matchResponse.status}). Check API key and quota.`);
                }
                const matchData = await matchResponse.json();
                if (matchData.error || !Array.isArray(matchData) || matchData.length === 0) {
                    console.error("Match Data Error:", matchData);
                    throw new Error(matchData.message || 'Match details not found or API error.');
                }
                setMatchDetails(matchData[0]); // Set match details first

                // --- Process Predictions ---
                let predictionData = null;
                let predictionError = null;
                if (!predictionResponse.ok) {
                    const errorText = await predictionResponse.text();
                    console.warn(`Failed to fetch predictions (Status: ${predictionResponse.status}): ${errorText}`);
                    if (predictionResponse.status === 404) {
                        predictionError = 'Predictions are not available for this match.';
                    } else if (errorText.toLowerCase().includes("rate limit") || errorText.toLowerCase().includes("quota")) {
                        predictionError = 'API quota exceeded. Please try again later.'; // More specific error
                    } else if (errorText.toLowerCase().includes("invalid api key")) {
                        predictionError = 'Invalid API Key used for predictions.';
                    }
                    else {
                        predictionError = 'Prediction data could not be loaded.';
                    }
                } else {
                    const rawPredictionData = await predictionResponse.json();
                    if (rawPredictionData.error || !Array.isArray(rawPredictionData)) {
                        console.warn("Prediction Data Error/Missing:", rawPredictionData.message || "No predictions content.");
                        predictionError = "Predictions data format error or not available.";
                    } else if (rawPredictionData.length === 0) {
                        console.warn("Prediction data array is empty for this match.");
                        predictionError = "Predictions are not available for this match.";
                    } else {
                        predictionData = rawPredictionData[0]; // Use the first prediction object
                        setPredictions(predictionData);
                        // Calculate score prediction *only if* prediction data is valid
                        setScorePredictionResult(calculateHighestProbScore(predictionData));
                    }
                }

                // Set prediction-specific error if it occurred
                if (predictionError) {
                    setError(predictionError); // Set non-fatal error to display a message
                }

            } catch (err) {
                console.error('Error in fetchMatchData:', err);
                // Provide specific error or a generic one
                let errorMessage = err.message || 'An unexpected error occurred while loading data.';
                if (err.message.toLowerCase().includes("api key")) {
                    errorMessage = "Invalid API Key provided.";
                } else if (err.message.toLowerCase().includes("rate limit") || err.message.toLowerCase().includes("quota")) {
                    errorMessage = "API rate limit or quota exceeded. Please try again later.";
                } else if (err.message.includes("Failed to fetch")) {
                    errorMessage = "Network error: Could not connect to the API service.";
                }
                // Set fatal error only if match details failed fundamentally
                if (!matchDetails) {
                    setError(errorMessage);
                } else {
                    // If match details loaded but something else failed (e.g., predictions)
                    // keep the less severe error message set earlier if available
                    setError(error || errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMatchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, apiKey]); // Add apiKey to dependencies - if it changes, refetch (though unlikely)


    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"/>
            </div>
        );
    }

    // Error State (if match details fundamentally failed to load)
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

    // Match Not Found State (API succeeded but returned no match for ID)
    if (!matchDetails && !loading && !error) {
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-100px)] bg-gray-50 flex items-center justify-center px-4">
                    <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">Match Not Found</h2>
                        <p className="text-gray-600 mb-6">The requested match could not be found. Please check the ID or browse other predictions.</p>
                        <Link href="/predictions" className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 font-semibold transition-colors">
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Predictions
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // Determine if full prediction details can be shown
    const showFullPredictions = matchDetails && predictions && scorePredictionResult;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Back Link */}
                <Link href="/predictions" className="inline-flex items-center text-gray-600 hover:text-red-700 mb-6 text-sm font-medium group">
                    <ChevronLeft className="w-5 h-5 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Predictions
                </Link>

                {/* Display prediction-specific error if applicable (match loaded, predictions failed) */}
                {matchDetails && !showFullPredictions && error && (
                    <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm shadow-sm">
                        <strong>Note:</strong> {error}. Showing available match details.
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {matchDetails && <MatchHeader matchDetails={matchDetails} predictions={predictions} />}

                        {showFullPredictions ? (
                            <>
                                <ScorePrediction scorePredictionResult={scorePredictionResult} />
                                <DetailedAnalysis predictions={predictions} matchDetails={matchDetails} scorePredictionResult={scorePredictionResult} />
                            </>
                        ) : matchDetails ? ( // Message if match exists but full predictions aren't shown
                            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                                <p className="text-gray-500 mt-2">Detailed prediction analysis is currently unavailable for this match.</p>
                                {error && <p className="text-xs text-yellow-700 mt-2">({error})</p>}
                            </div>
                        ) : null }
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Match Info Card (Always show if matchDetails exists) */}
                        {matchDetails && (
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
                                            <Users className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> {/* Placeholder icon */}
                                            <div>
                                                <div className="text-xs text-gray-500">Venue</div>
                                                <div className="font-medium text-gray-900 text-sm">{matchDetails.match_stadium}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Prediction-based Sidebar Widgets (Show only if full predictions are available) */}
                        {showFullPredictions && (
                            <>
                                <BettingTips predictions={predictions} matchDetails={matchDetails} />

                                {/* Win Probabilities Card */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Win Probabilities</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{matchDetails.match_hometeam_name} Win</span>
                                                <span className="font-semibold text-green-600">{parseFloat(predictions.prob_HW || 0).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${parseFloat(predictions.prob_HW || 0)}%` }}/>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                                <span className="text-gray-700 font-medium">Draw</span>
                                                <span className="font-semibold text-yellow-600">{parseFloat(predictions.prob_D || 0).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${parseFloat(predictions.prob_D || 0)}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{matchDetails.match_awayteam_name} Win</span>
                                                <span className="font-semibold text-red-600">{parseFloat(predictions.prob_AW || 0).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-red-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${parseFloat(predictions.prob_AW || 0)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sticky Betting Odds Button (Optional) */}
                                {/* <div className="sticky bottom-4 lg:static lg:mt-0 z-10">
                                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl px-4 py-3 font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl text-sm md:text-base">
                                        <DollarSign className="w-5 h-5" />
                                        <span>View Best Betting Odds</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div> */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}