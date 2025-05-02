'use client';

import {
    TrendingUp, Calendar, Timer, ChevronLeft, BarChart2,
    CheckCircle, XCircle, Scale, ChevronRight, Goal,
    Users, DollarSign, Brain, Sparkles, Banknote, Loader2,
    Shield, Activity, Clock, AlertTriangle
} from 'lucide-react';

// AI Score Prediction Component
export const AIScorePrediction = ({ aiAnalysis }) => {
    if (!aiAnalysis || !aiAnalysis.score_prediction) return null;

    const { home, away, confidence } = aiAnalysis.score_prediction;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4"> Score Prediction</h3>
    <div className="text-center">
    <div className="inline-block bg-red-50 px-6 py-3 rounded-lg">
    <div className="text-3xl font-bold text-red-600">
        {home} - {away}
        </div>
        <div className="text-sm text-gray-500 mt-1">
         Confidence: {confidence}%
    </div>
    </div>
    </div>
    </div>
);
};

// AI Match Outcome Display Component for Header
export const AIOutcomePrediction = ({ aiAnalysis, matchDetails }) => {
    if (!aiAnalysis || !aiAnalysis.winner || !matchDetails) return null;

    const getWinnerDisplay = () => {
        if (aiAnalysis.winner === "Draw") return "Draw";
        if (aiAnalysis.winner === "Home") return `${matchDetails.match_hometeam_name} Win`;
        if (aiAnalysis.winner === "Away") return `${matchDetails.match_awayteam_name} Win`;
        return "Uncertain";
    };

    return (
        <div className="text-center">
        <div className="text-sm text-gray-500 mb-2">Most Likely Result</div>
    <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-medium text-xs md:text-sm min-h-[40px] flex items-center justify-center">
        {getWinnerDisplay()}
        </div>
        <div className="text-xs text-gray-400 mt-3 truncate hidden md:block">
        {matchDetails.league_name}{matchDetails.country_name ? ` - ${matchDetails.country_name}` : ''}
    </div>
    <div className="text-xs text-gray-400 mt-1 truncate md:hidden">
        {matchDetails.league_name}
        </div>
        </div>
);
};

// AI Key Predictions Component
export const AIKeyPredictions = ({ aiAnalysis, matchDetails }) => {
    if (!aiAnalysis) return null;

    // Helper function to create prediction items
    const createPredictionItem = (title, prediction, confidence) => {
        const PredIcon = prediction === "Yes" ? CheckCircle : XCircle;
        const textColor = prediction === "Yes" ? "text-green-600" : "text-red-600";

        return (
            <div className="p-4 bg-gray-50 rounded-lg flex items-start space-x-3">
            <PredIcon className={`w-6 h-6 ${textColor} flex-shrink-0 mt-1`} />
        <div>
        <div className="text-sm text-gray-500 mb-1">{title}</div>
            <div className={`text-lg font-semibold ${textColor}`}>{prediction}</div>
        <div className="text-xs text-gray-400">({confidence}%)</div>
            </div>
            </div>
    );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4"> Key Predictions</h3>
    <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {aiAnalysis.over_goals && createPredictionItem(
                `Over ${aiAnalysis.over_goals.threshold} Goals?`,
                aiAnalysis.over_goals.prediction,
                aiAnalysis.over_goals.confidence
            )}

    {aiAnalysis.both_teams_to_score && createPredictionItem(
        "Both Teams to Score?",
        aiAnalysis.both_teams_to_score.prediction,
        aiAnalysis.both_teams_to_score.confidence
    )}
    </div>

    {matchDetails && aiAnalysis.winner && aiAnalysis.winner_confidence && (
        <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Match Outcome Confidence</h4>
    <div className="space-y-3">
    <div className="space-y-1">
    <div className="flex justify-between text-xs text-gray-600">
        <span>{aiAnalysis.winner === "Draw" ? "Draw" :
                aiAnalysis.winner === "Home" ? `${matchDetails.match_hometeam_name} Win` :
                    `${matchDetails.match_awayteam_name} Win`}</span>
        <span>{aiAnalysis.winner_confidence}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
    <div className="h-full bg-blue-500 transition-all duration-500"
        style={{ width: `${aiAnalysis.winner_confidence}%` }} />
    </div>
    </div>
    </div>
    </div>
    )}
    </div>
    </div>
);
};

// AI Tactical Insights Component
export const AITacticalInsights = ({ aiAnalysis }) => {
    if (!aiAnalysis || !aiAnalysis.key_insights || aiAnalysis.key_insights.length === 0) return null;

    // Convert emoji strings to display correctly
    const getIconDisplay = (iconString) => {
        return iconString || "🔍"; // Default icon if none provided
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="border-b pb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-600" />
             Tactical Breakdown
    </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-4 bg-blue-50 rounded-lg">
    <h4 className="font-semibold mb-2 flex items-center gap-2">
    <Sparkles className="w-4 h-4" /> Key Patterns
    </h4>
    <ul className="space-y-3">
        {aiAnalysis.key_insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${insight.confidence === 'High' ? 'bg-green-100' : 'bg-yellow-100'}`}>
        {getIconDisplay(insight.icon)}
    </div>
    <div>
    <p className="font-medium">{insight.title}</p>
        <p className="text-sm text-gray-600">{insight.content}</p>
        </div>
        </li>
))}
    </ul>
    </div>

    {aiAnalysis.value_bets && aiAnalysis.value_bets.length > 0 && (
        <div className="p-4 bg-orange-50 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
        <Banknote className="w-4 h-4" /> Value Bets
    </h4>
    <div className="space-y-4">
    {aiAnalysis.value_bets.map((bet, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-white rounded border">
        <div>
            <p className="font-medium">{bet.market}</p>
            <p className="text-sm">{bet.prediction}</p>
        </div>
        <div className={`text-right ${bet.edge.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
    <p className="font-bold">{bet.odds}</p>
        <p className="text-xs">{bet.edge}</p>
        </div>
        </div>
    ))}
        </div>
        </div>
    )}
    </div>
    </div>
);
};