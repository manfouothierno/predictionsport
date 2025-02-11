import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Star } from 'lucide-react';
import Link from "next/link";
import {Button} from "@nextui-org/react";

export default function TopPredictions() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
                    .toISOString().split('T')[0];

                const response = await fetch(
                    `https://apiv3.apifootball.com/?action=get_events&APIkey=a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004&from=${today}&to=${tomorrow}`
                );

                if (!response.ok) throw new Error('Failed to fetch matches');
                const data = await response.json();

                // Filter for upcoming matches only and limit to 6
                const upcomingMatches = data
                    .filter(match =>
                        match.match_status === 'Not Started' ||
                        match.match_status === '' ||
                        match.match_status === 'Time To Be Defined'
                    )
                    .slice(0, 6);

                setMatches(upcomingMatches);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="my-10">
                    <h1 className="text-4xl sm:text-3xl lg:text-5xl font-bold mt-5 leading-tight">
                        Expert Football Predictions & Analysis
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-900 max-w-xl">
                        Get real-time match predictions powered by advanced analytics and expert insights. Stay ahead of the game with our accurate forecasting.
                    </p>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Upcoming Matches
                        </h2>
                        <p className="mt-2 text-gray-600">Expert picks with highest confidence</p>
                    </div>
                    <Link href={'/predictions/today'} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        View All
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No upcoming matches available at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((match) => (
                            <motion.div
                                key={match.match_id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {match.match_hometeam_name} vs {match.match_awayteam_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{match.league_name}</p>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            UPCOMING
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 w-full text-center">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Kickoff</p>
                                            <p className="font-medium">{match.match_time}</p>
                                            <p className="font-small text-sm text-gray-500 ">{match.match_date}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg flex justify-evenly items-end col-span-2 gap-10 p-3">
                                            <div>
                                                <img
                                                    src={match.team_home_badge}
                                                    alt={match.match_hometeam_name}
                                                    className="w-8 h-8 mx-auto mb-2 object-contain"
                                                />
                                                <p className="text-xs text-gray-500 mb-1">Home</p>
                                                <p className="font-medium text-sm">{match.match_hometeam_name}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 mb-1">Vs.</span>
                                            <div>
                                                <img
                                                    src={match.team_away_badge}
                                                    alt={match.match_awayteam_name}
                                                    className="w-8 h-8 mx-auto mb-2 object-contain"
                                                />
                                                <p className="text-xs text-gray-500 mb-1">Away</p>
                                                <p className="font-medium text-sm">{match.match_awayteam_name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-0">
                                        <Link  href={`/predictions/analysis/${match.match_id}`}  >
                                            <button   className="w-full py-2 px-4 mt-3 bg-gradient-to-r from-red-600 to-red-700 text-white  rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all">
                                                View Predictions
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <Trophy className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">92%</p>
                            <p className="text-sm text-gray-500">Success Rate</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">+150</p>
                            <p className="text-sm text-gray-500">Daily Predictions</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">4.8/5</p>
                            <p className="text-sm text-gray-500">User Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}