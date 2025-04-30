'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Timer, ChevronLeft, BarChart2, CheckCircle, XCircle, Scale, ChevronRight, Goal, Users, DollarSign } from 'lucide-react'; // Ensure needed icons
import Link from "next/link";
import Navbar from "@/app/[lang]/langing/Navbar"; // Ensure correct path

// Helper function to get Yes/No prediction based on percentage and threshold
const getPredictionYesNo = (percentage, threshold = 50) => {
    const p = parseFloat(percentage) || 0;
    if (p > threshold) {
        return { text: 'Yes', color: 'text-green-600', icon: CheckCircle };
    } else {
        return { text: 'No', color: 'text-red-600', icon: XCircle };
    }
};

// Score Prediction Component (Remains the same)
const ScorePrediction = ({ predictions }) => {
    const getHighestProbScore = () => {
        const overProb = parseFloat(predictions.prob_O) || 0;
        const underProb = parseFloat(predictions.prob_U) || 0;
        const homeWinProb = parseFloat(predictions.prob_HW) || 0;
        const awayWinProb = parseFloat(predictions.prob_AW) || 0;
        const drawProb = parseFloat(predictions.prob_D) || 0;
        const btsProb = parseFloat(predictions.prob_bts) || 0;

        // Prioritize higher probability scenarios for scorelines
        if (homeWinProb > 75 && overProb > 70 && btsProb > 65) return { home: 2, away: 1, probability: Math.min(95, Math.floor(homeWinProb * 0.7 + overProb * 0.15 + btsProb * 0.15)) };
        if (homeWinProb > 75 && overProb > 70) return { home: 2, away: 0, probability: Math.min(95, Math.floor(homeWinProb * 0.8 + overProb * 0.2)) };
        if (homeWinProb > 70 && underProb > 60) return { home: 1, away: 0, probability: Math.min(95, Math.floor(homeWinProb * 0.8 + underProb * 0.2)) };

        if (awayWinProb > 75 && overProb > 70 && btsProb > 65) return { home: 1, away: 2, probability: Math.min(95, Math.floor(awayWinProb * 0.7 + overProb * 0.15 + btsProb * 0.15)) };
        if (awayWinProb > 75 && overProb > 70) return { home: 0, away: 2, probability: Math.min(95, Math.floor(awayWinProb * 0.8 + overProb * 0.2)) };
        if (awayWinProb > 70 && underProb > 60) return { home: 0, away: 1, probability: Math.min(95, Math.floor(awayWinProb * 0.8 + underProb * 0.2)) };

        if (drawProb > 50 && btsProb > 60) return { home: 1, away: 1, probability: Math.min(90, Math.floor(drawProb * 0.8 + btsProb * 0.2)) };
        if (drawProb > 50 && underProb > 60) return { home: 0, away: 0, probability: Math.min(90, Math.floor(drawProb * 0.8 + underProb * 0.2)) };

        // Fallback based on most likely single outcome
        if (homeWinProb >= awayWinProb && homeWinProb >= drawProb) return { home: 1, away: 0, probability: Math.floor(homeWinProb * 0.6) };
        if (awayWinProb > homeWinProb && awayWinProb >= drawProb) return { home: 0, away: 1, probability: Math.floor(awayWinProb * 0.6) };

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
                    <div className="text-sm text-gray-500 mt-1">
                        Model Confidence: {scorePrediction.probability}%
                    </div>
                </div>
            </div>
        </div>
    );
};

// Betting Tips Component - Simplified to Yes/No based on threshold
const BettingTips = ({ predictions, matchDetails }) => {
    const threshold = 50; // Define the threshold for 'Yes'

    const getTips = () => {
        const tips = [];
        const probO = parseFloat(predictions.prob_O) || 0;
        const probU = parseFloat(predictions.prob_U) || 0;
        const probHW = parseFloat(predictions.prob_HW) || 0;
        const probAW = parseFloat(predictions.prob_AW) || 0;
        const probBTS = parseFloat(predictions.prob_bts) || 0;
        const probNTS = 100 - probBTS; // Probability of Not Both Teams Scoring

        // Over/Under Tips
        const overPred = getPredictionYesNo(probO, threshold);
        if (overPred.text === 'Yes') {
            tips.push({
                tip: "Over 2.5 Goals: Yes",
                probability: probO, // Store the actual probability
                prediction: overPred,
                reasoning: `Model predicts >${threshold}% chance.`,
                icon: Goal, // Or use prediction.icon? Stick with market icon.
            });
        }
        const underPred = getPredictionYesNo(probU, threshold);
        if (underPred.text === 'Yes') { // Check if probability of Under > threshold
            tips.push({
                tip: "Under 2.5 Goals: Yes",
                probability: probU,
                prediction: underPred,
                reasoning: `Model predicts >${threshold}% chance.`,
                icon: Scale,
            });
        }


        // Win probability tips
        const homeWinPred = getPredictionYesNo(probHW, threshold);
        if (homeWinPred.text === 'Yes') {
            tips.push({
                tip: `${matchDetails?.match_hometeam_name || 'Home'} to Win: Yes`,
                probability: probHW,
                prediction: homeWinPred,
                reasoning: `Model predicts >${threshold}% chance.`,
                icon: TrendingUp, // Could be CheckCircle if we only want Yes/No icons
            });
        }
        const awayWinPred = getPredictionYesNo(probAW, threshold);
        if (awayWinPred.text === 'Yes') {
            tips.push({
                tip: `${matchDetails?.match_awayteam_name || 'Away'} to Win: Yes`,
                probability: probAW,
                prediction: awayWinPred,
                reasoning: `Model predicts >${threshold}% chance.`,
                icon: TrendingUp,
            });
        }

        // Both teams to score Tip using Yes/No
        const btsPred = getPredictionYesNo(probBTS, threshold);
        if (btsPred.text === 'Yes') {
            tips.push({
                tip: "Both Teams to Score: Yes",
                probability: probBTS,
                prediction: btsPred,
                reasoning: `Model predicts >${threshold}% chance.`,
                icon: Goal, // Use market icon Goal for BTS yes
            });
        }
        const ntsPred = getPredictionYesNo(probNTS, threshold); // Check NTS probability
        if(ntsPred.text === 'Yes') { // If NTS > threshold
            tips.push({
                tip: "Both Teams to Score: No",
                probability: probNTS, // Probability supporting 'No'
                prediction: ntsPred, // Use the NTS prediction which will be {text:'Yes', ...} here
                reasoning: `Model predicts >${threshold}% chance of NO.`,
                icon: XCircle, // Specific No icon
            });
        }


        // Optional: Prioritize tips with higher probability if list gets too long
        tips.sort((a, b) => b.probability - a.probability);
        return tips.slice(0, 4); // Limit to top 4 strongest tips

        //return tips;
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
                            {/* Show the icon associated with the market/outcome */}
                            <div className="flex-shrink-0">
                                <tip.prediction.icon className={`h-5 w-5 ${tip.prediction.color}`} />
                                {/*<tip.icon className={`h-5 w-5 text-gray-600`} />*/} {/* Use market icon instead? */}
                            </div>
                            <div className="flex-1">
                                {/* Display the tip (e.g., "Home to Win: Yes") */}
                                <div className="font-medium text-gray-900">{tip.tip}</div>
                                {/* Optionally show the exact probability */}
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

// Detailed Analysis Component - Use simplified Yes/No
const DetailedAnalysis = ({ predictions, matchDetails }) => {
    const threshold = 50; // Ensure consistent threshold
    // Use the Yes/No helper
    const overPrediction = getPredictionYesNo(predictions.prob_O, threshold);
    const btsPrediction = getPredictionYesNo(predictions.prob_bts, threshold);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Market Predictions (>{threshold}% Threshold)</h3>
            <div className="space-y-6">
                {/* Team Formations */}
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

                {/* Goal / BTS Predictions - Using Yes/No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                        <overPrediction.icon className={`w-6 h-6 ${overPrediction.color}`} />
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Over 2.5 Goals?</div>
                            <div className={`text-lg font-semibold ${overPrediction.color}`}>{overPrediction.text}</div>
                            <div className="text-xs text-gray-400">({predictions.prob_O}%)</div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                        <btsPrediction.icon className={`w-6 h-6 ${btsPrediction.color}`} />
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Both Teams to Score?</div>
                            <div className={`text-lg font-semibold ${btsPrediction.color}`}>{btsPrediction.text}</div>
                            <div className="text-xs text-gray-400">({predictions.prob_bts}%)</div>
                        </div>
                    </div>
                </div>

                {/* Win Prediction Simplified */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => { // Immediately invoked function to simplify conditional rendering
                        const homeWinPred = getPredictionYesNo(predictions.prob_HW, threshold);
                        return (
                            <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                                <homeWinPred.icon className={`w-6 h-6 ${homeWinPred.color}`} />
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">{matchDetails.match_hometeam_name} to Win?</div>
                                    <div className={`text-lg font-semibold ${homeWinPred.color}`}>{homeWinPred.text}</div>
                                    <div className="text-xs text-gray-400">({predictions.prob_HW}%)</div>
                                </div>
                            </div>
                        );
                    })()}
                    {(() => {
                        const awayWinPred = getPredictionYesNo(predictions.prob_AW, threshold);
                        return (
                            <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                                <awayWinPred.icon className={`w-6 h-6 ${awayWinPred.color}`} />
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">{matchDetails.match_awayteam_name} to Win?</div>
                                    <div className={`text-lg font-semibold ${awayWinPred.color}`}>{awayWinPred.text}</div>
                                    <div className="text-xs text-gray-400">({predictions.prob_AW}%)</div>
                                </div>
                            </div>
                        );
                    })()}
                </div>


                {/* Asian Handicap Analysis (Kept as percentages are specific lines) */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Asian Handicap Probability (Home Team)</h4>
                    <div className="space-y-3">
                        {[ // Filter and map valid entries
                            { label: "-0.5", home: predictions.prob_ah_h_05 || 'N/A' },
                            { label: "-1.5", home: predictions.prob_ah_h_15 || 'N/A' },
                        ]
                            .filter(h => h.home !== 'N/A' && h.home !== "" && parseFloat(h.home) >= 0) // Check valid number too
                            .map((handicap, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Home {handicap.label}</span>
                                        <span>{parseFloat(handicap.home).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 transition-all duration-500"
                                            style={{ width: `${handicap.home}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        { ![predictions.prob_ah_h_05, predictions.prob_ah_h_15].some(p => p && p !== 'N/A' && p !== "" && parseFloat(p) >= 0) &&
                            <p className="text-sm text-gray-400 text-center">Asian Handicap data not available or probabilities are 0.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

// Match Header Component - Simplified Prediction Outcome Text
const MatchHeader = ({ matchDetails, predictions }) => {
    const getPredictionOutcomeText = () => {
        const homeProb = parseFloat(predictions.prob_HW) || 0;
        const awayProb = parseFloat(predictions.prob_AW) || 0;
        const drawProb = parseFloat(predictions.prob_D) || 0;

        const maxProb = Math.max(homeProb, awayProb, drawProb);

        if (maxProb === homeProb) return `${matchDetails.match_hometeam_name} Win`;
        if (maxProb === awayProb) return `${matchDetails.match_awayteam_name} Win`;
        return 'Draw'; // If draw is highest or all are equal/zero
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
                    <div className="text-sm text-gray-500 mb-2">Most Likely Result</div>
                    {/* Simplified outcome text */}
                    <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-medium text-xs md:text-sm">
                        {getPredictionOutcomeText()}
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

// Main Component
export default function MatchAnalysis({ params }) {
    const [matchDetails, setMatchDetails] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // IMPORTANT: Replace with your actual API key securely (e.g., environment variable)
    const [apiKey] = useState(process.env.NEXT_PUBLIC_API_FOOTBALL_KEY || "a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004");


    useEffect(() => {
        // Make sure API Key is set
        if (!apiKey || apiKey === "YOUR_API_FOOTBALL_API_KEY") {
            console.error("API Key is not set!");
            setError("API Key is missing. Please configure it (e.g., using NEXT_PUBLIC_API_FOOTBALL_KEY environment variable).");
            setLoading(false);
            return;
        }

        const fetchMatchData = async () => {
            setLoading(true);
            setError(null);
            setMatchDetails(null); // Reset details on new fetch
            setPredictions(null); // Reset predictions on new fetch
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
                toDate.setDate(today.getDate() + 2); // Check wider range JIC

                const fromStr = fromDate.toISOString().split('T')[0];
                const toStr = toDate.toISOString().split('T')[0];

                console.log(`Fetching data for match ID: ${matchId}, Date Range: ${fromStr} to ${toStr}`);

                const [matchResponse, predictionResponse] = await Promise.all([
                    fetch(`https://apiv3.apifootball.com/?action=get_events&APIkey=${apiKey}&from=${fromStr}&to=${toStr}&match_id=${matchId}`),
                    fetch(`https://apiv3.apifootball.com/?action=get_predictions&APIkey=${apiKey}&from=${fromStr}&to=${toStr}&match_id=${matchId}`)
                ]);

                // Check HTTP status first
                if (!matchResponse.ok) {
                    console.error("Match API Response Error:", matchResponse.status, await matchResponse.text());
                    throw new Error(`Failed to fetch match details (Status: ${matchResponse.status})`);
                }
                if (!predictionResponse.ok) {
                    console.error("Prediction API Response Error:", predictionResponse.status, await predictionResponse.text());
                    // Don't throw immediately, allow match details to load if possible
                    console.warn(`Failed to fetch predictions (Status: ${predictionResponse.status}). Will attempt to display match details.`);
                    const matchData = await matchResponse.json();
                    if (matchData.error || !Array.isArray(matchData) || matchData.length === 0) {
                        console.error("Match Data Error:", matchData);
                        throw new Error(matchData.message || 'Match details not found or API error.');
                    }
                    setMatchDetails(matchData[0]);
                    setError('Prediction data could not be loaded.'); // Set non-fatal error
                    setLoading(false);
                    return; // Exit early, but keep loaded match data
                }


                const matchData = await matchResponse.json();
                const predictionData = await predictionResponse.json();

                // Check for API-level errors in the response body
                if (matchData.error || !Array.isArray(matchData) || matchData.length === 0) {
                    console.error("Match Data Error:", matchData);
                    throw new Error(matchData.message || 'Match details not found.');
                }
                if (predictionData.error || !Array.isArray(predictionData)) { // Allow empty array for no predictions
                    console.error("Prediction Data Error:", predictionData);
                    // Be more lenient if predictions just aren't available yet
                    setMatchDetails(matchData[0]); // Keep match details
                    if(predictionData.message && predictionData.message.includes("rate limit")){
                        throw new Error(predictionData.message); // Rate limit is a hard error
                    } else {
                        console.warn("Prediction data error/missing:", predictionData.message || "No predictions available.");
                        setError("Predictions not available for this match."); // Inform user
                    }
                } else {
                    setMatchDetails(matchData[0]);
                    setPredictions(predictionData.length > 0 ? predictionData[0] : null); // Set to null if array is empty
                }


            } catch (err) {
                console.error('Error fetching match data:', err);
                // Provide specific error or a generic one
                if (err.message.includes("APIkey")) {
                    setError("Invalid API Key provided.");
                } else if (err.message.includes("rate limit")) {
                    setError("API rate limit exceeded. Please try again later.");
                } else {
                    setError(err.message || 'Failed to load match data. Please check the Match ID or try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMatchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]); // Removed apiKey from dependency array - should be set once via env

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"/>
            </div>
        );
    }

    // Error or No Match Found Display
    if ((!matchDetails && !loading) || (error && !matchDetails) ) { // Check if matchDetails is truly null after loading, or hard error occurred
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-100px)] bg-gray-50 flex items-center justify-center px-4">
                    <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-red-600 mb-3">Could Not Load Match</h2>
                        <p className="text-gray-600 mb-6">{error || 'Match details could not be found. Please check the match ID or select another match.'}</p>
                        <Link href="/predictions" className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 font-semibold transition-colors">
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Predictions
                        </Link>
                    </div>
                </div>
            </>
        );
    }


    // If match loaded but predictions failed/missing, show limited info
    const showPredictions = matchDetails && predictions;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Link href="/predictions" className="inline-flex items-center text-gray-600 hover:text-red-700 mb-6 text-sm font-medium group">
                    <ChevronLeft className="w-5 h-5 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Predictions
                </Link>

                {/* Display specific error about predictions if applicable */}
                {matchDetails && !predictions && error && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
                        <strong>Note:</strong> {error} Match details are shown below, but prediction analysis is unavailable.
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Always show MatchHeader if matchDetails exists */}
                        {matchDetails && <MatchHeader matchDetails={matchDetails} predictions={predictions || {}} />} {/* Pass empty predictions obj if null */}

                        {/* Show prediction components only if predictions are available */}
                        {showPredictions ? (
                            <>
                                <ScorePrediction predictions={predictions} />
                                <DetailedAnalysis predictions={predictions} matchDetails={matchDetails} />
                            </>
                        ) : matchDetails ? ( // Message if match exists but predictions don't
                            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                                <p className="text-gray-500 mt-2">Prediction data is not available for this match.</p>
                            </div>
                        ) : null }
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
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

                        {showPredictions && (
                            <>
                                <BettingTips predictions={predictions} matchDetails={matchDetails} />

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Win Probabilities</h3>
                                    {/* Still useful to show raw probabilities here */}
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