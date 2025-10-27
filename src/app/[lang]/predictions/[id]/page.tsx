'use client';

import { useState, useEffect } from 'react';
import { Calendar, Timer, ChevronLeft, BarChart2, Users, TrendingUp, Target, Clock } from 'lucide-react';
import Link from 'next/link';
import Navbar from "@/app/[lang]/langing/Navbar";
import { getMatchWithPredictions } from '@/lib/matches';
import { MatchWithDetails } from '@/types/database';
import { Prediction, User } from '@/types/database';
import { format } from 'date-fns';

interface PredictionWithExpert extends Prediction {
  expert: User;
}

// Match Header Component
const MatchHeader = ({ match }: { match: MatchWithDetails }) => {
  const league = match.leagues?.[0] || match.competitions?.[0];
  const matchDate = new Date(match.match_date);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Home Team */}
        <div className="text-center flex flex-col items-center">
          <img
            src={match.home_team.logo_url || '/placeholder-team.png'}
            alt={match.home_team.name}
            className="w-16 h-16 md:w-20 md:h-20 mx-auto object-contain mb-2"
          />
          <h3 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
            {match.home_team.name}
          </h3>
          <div className="text-xs text-gray-500 mt-1">(Home)</div>
        </div>

        {/* Match Info */}
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">
            {match.status === 'live' ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                LIVE
              </span>
            ) : match.status === 'completed' ? (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                FT: {match.home_score} - {match.away_score}
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Upcoming
              </span>
            )}
          </div>
          {match.status === 'scheduled' && (
            <div className="text-xs text-gray-400 mt-2">
              {format(matchDate, 'MMM dd, yyyy • HH:mm')}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {league?.name}
          </div>
        </div>

        {/* Away Team */}
        <div className="text-center flex flex-col items-center">
          <img
            src={match.away_team.logo_url || '/placeholder-team.png'}
            alt={match.away_team.name}
            className="w-16 h-16 md:w-20 md:h-20 mx-auto object-contain mb-2"
          />
          <h3 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
            {match.away_team.name}
          </h3>
          <div className="text-xs text-gray-500 mt-1">(Away)</div>
        </div>
      </div>
    </div>
  );
};

// Expert Prediction Card
const ExpertPredictionCard = ({ prediction }: { prediction: PredictionWithExpert }) => {
  const getWinnerText = () => {
    if (prediction.winner_prediction === 'home') return 'Home Win';
    if (prediction.winner_prediction === 'away') return 'Away Win';
    if (prediction.winner_prediction === 'draw') return 'Draw';
    return null;
  };

  const getScoreText = () => {
    if (prediction.home_prediction !== null && prediction.away_prediction !== null) {
      return `${prediction.home_prediction} - ${prediction.away_prediction}`;
    }
    return null;
  };

  // Safe access to expert data
  const expertName = prediction.expert?.username || 'Unknown Expert';
  const expertPhoto = prediction.expert?.photo_url;
  const isExpert = prediction.expert?.is_expert || false;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-600">
      {/* Expert Info */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        {expertPhoto ? (
          <img
            src={expertPhoto}
            alt={expertName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 font-bold text-lg">
              {expertName[0].toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{expertName}</h4>
          <p className="text-xs text-gray-500">
            {isExpert ? 'Expert Analyst' : 'Analyst'}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm">
            <Target className="w-4 h-4 text-red-600" />
            <span className="font-semibold text-gray-900">
              {Math.round(prediction.confidence_score * 100)}%
            </span>
          </div>
          <p className="text-xs text-gray-500">Confidence</p>
        </div>
      </div>

      {/* Prediction Details */}
      <div className="space-y-3">
        {getWinnerText() && (
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Result Prediction</div>
            <div className="text-lg font-bold text-red-600">{getWinnerText()}</div>
          </div>
        )}

        {getScoreText() && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Score Prediction</div>
            <div className="text-2xl font-bold text-gray-900">{getScoreText()}</div>
          </div>
        )}

        {prediction.odds && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Suggested Odds:</span>
            <span className="font-semibold text-gray-900">{prediction.odds}</span>
          </div>
        )}
      </div>

      {/* Analysis */}
      {prediction.analysis && (
        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Expert Analysis</h5>
          <p className="text-sm text-gray-600 leading-relaxed">{prediction.analysis}</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t text-xs text-gray-400">
        Prediction type: {prediction.prediction_type.toUpperCase()}
      </div>
    </div>
  );
};

// Main Component
export default function PredictionDetail({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const [match, setMatch] = useState<MatchWithDetails | null>(null);
  const [predictions, setPredictions] = useState<PredictionWithExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const resolvedParams = await params;
        const matchId = resolvedParams?.id;

        if (!matchId) {
          throw new Error('Match ID is missing');
        }

        const { match: matchData, predictions: predictionsData } = await getMatchWithPredictions(matchId);

        if (!matchData) {
          setError('Match not found');
          return;
        }

        setMatch(matchData);
        setPredictions(predictionsData as PredictionWithExpert[]);
      } catch (err) {
        console.error('Error fetching match data:', err);
        setError('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading match details...</h1>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-100px)] bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-red-600 mb-3">Could Not Load Match</h2>
            <p className="text-gray-600 mb-6">{error || 'Match not found'}</p>
            <Link
              href="/predictions/today"
              className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 font-semibold transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Predictions
            </Link>
          </div>
        </div>
      </>
    );
  }

  const league = match.leagues?.[0] || match.competitions?.[0];
  const matchDate = new Date(match.match_date);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Link */}
        <Link
          href="/predictions/today"
          className="inline-flex items-center text-gray-600 hover:text-red-700 mb-6 text-sm font-medium group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Predictions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <MatchHeader match={match} />

            {/* Expert Predictions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Expert Predictions</h3>

              {predictions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No expert predictions available yet for this match.</p>
                  <p className="text-sm text-gray-400 mt-2">Check back closer to match time.</p>
                </div>
              ) : (
                predictions.map((prediction) => (
                  <ExpertPredictionCard key={prediction.id} prediction={prediction} />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Match Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Match Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500">Date</div>
                    <div className="font-medium text-gray-900 text-sm">
                      {format(matchDate, 'MMMM dd, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500">Time</div>
                    <div className="font-medium text-gray-900 text-sm">
                      {format(matchDate, 'HH:mm')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500">Competition</div>
                    <div className="font-medium text-gray-900 text-sm">{league?.name || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="font-medium text-gray-900 text-sm capitalize">{match.status}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictions Summary */}
            {predictions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Predictions Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Predictions:</span>
                    <span className="font-semibold text-gray-900">{predictions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Confidence:</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(
                        predictions.reduce((sum, p) => sum + p.confidence_score, 0) / predictions.length * 100
                      )}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
