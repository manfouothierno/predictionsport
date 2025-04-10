import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Star, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { PredictionCard } from '@/components/PredictionCard'; // Make sure this path is correct
import PromotionalBanner from '@/components/PromotionalBanner'; // Make sure this path is correct

// Define important league IDs (adjust as needed)
const IMPORTANT_LEAGUE_IDS = [
    '3',   // UEFA Champions League (Check ID if different)
    '152', // Premier League
    '302', // La Liga
    '207', // Serie A
    '175', // Bundesliga
    '168', // Ligue 1
    '4',   // Europa League (Check ID if different)
    // Add other important league IDs here
];

// Define statuses indicating an upcoming match
const UPCOMING_STATUSES = ['Not Started', '', 'Time To Be Defined'];

export default function TopPredictions() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    // WARNING: Hardcoding API keys is insecure for client-side code.
    // It's better to use a backend proxy or serverless function.
    const API_KEY = 'a416a23b2f17f2c7e90d41aab89229bb3d445f2b5616c45f03f054eef6876004';

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true); // Ensure loading starts true
            try {
                const today = new Date().toISOString().split('T')[0];
                const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
                    .toISOString().split('T')[0];

                // Consider fetching for a slightly larger window if needed to ensure 12 matches
                // e.g., const dayAfterTomorrow = ...

                const response = await fetch(
                    `https://apiv3.apifootball.com/?action=get_events&APIkey=${API_KEY}&from=${today}&to=${tomorrow}`
                );

                if (!response.ok) {
                    // Handle API errors more gracefully
                    const errorData = await response.json().catch(() => null); // Try to parse error
                    console.error('API Error Response:', errorData);
                    throw new Error(`Failed to fetch matches. Status: ${response.status}`);
                }

                const data = await response.json();

                // Handle cases where the API might return an error object instead of an array
                if (!Array.isArray(data)) {
                    if (data && data.error) {
                        console.error("API Returned Error:", data.message || 'Unknown API Error');
                        throw new Error(data.message || 'API Error');
                    }
                    console.error("Unexpected API response format:", data);
                    throw new Error("Unexpected API response format");
                }

                // 1. Filter for upcoming matches
                const upcomingMatches = data.filter(match =>
                    UPCOMING_STATUSES.includes(match.match_status)
                );

                // 2. Sort the upcoming matches
                const sortedMatches = upcomingMatches.sort((a, b) => {
                    const aIsImportant = IMPORTANT_LEAGUE_IDS.includes(a.league_id);
                    const bIsImportant = IMPORTANT_LEAGUE_IDS.includes(b.league_id);

                    // Prioritize important leagues
                    if (aIsImportant && !bIsImportant) return -1;
                    if (!aIsImportant && bIsImportant) return 1;

                    // If both are same importance, sort chronologically
                    const dateA = new Date(`${a.match_date}T${a.match_time || '00:00:00'}`);
                    const dateB = new Date(`${b.match_date}T${b.match_time || '00:00:00'}`);

                    // Handle potential invalid dates
                    const timeA = isNaN(dateA.getTime()) ? Infinity : dateA.getTime();
                    const timeB = isNaN(dateB.getTime()) ? Infinity : dateB.getTime();

                    return timeA - timeB;
                });

                // 3. Slice to get the top 12 (or fewer if less available)
                const topMatches = sortedMatches.slice(0, 12);

                setMatches(topMatches);

            } catch (error) {
                console.error('Error fetching or processing matches:', error);
                // Set matches to empty array on error to avoid render issues
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []); // Removed API_KEY from dependency array as it's constant here

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto mt-1 sm:px-6 lg:px-8 py-4">
                {/* Promotional Banners */}
                <PromotionalBanner
                    brand="1xbet"
                    promoUrl="#"
                    bonus="50,000 FCFA"
                    brandLogo={'https://v3.traincdn.com/genfiles/cms/55-654/desktop/media_asset/93f175f039aa059b186bc29c157e8cc4.svg'}
                />
                <PromotionalBanner
                    brand="melbet"
                    promoUrl="#"
                    bonus="45,000 FCFA"
                    brandLogo={'https://v3.traincdn.com/genfiles/cms/8-62/desktop/media_asset/dd77c8f1b5bd23e38cd81fb7d861af10.svg'}
                />
                {/*<PromotionalBanner brand="linebet" promoUrl="#" bonus="40,000 FCFA" />*/}
            </div>
            <div className="max-w-7xl mx-auto mt-2 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Upcoming Matches
                        </h1>
                        <p className="mt-2 text-gray-600">Top expert picks & major leagues</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No upcoming matches found for the selected leagues and dates.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((match) => (
                            // Using PredictionCard component directly
                            <PredictionCard key={match.match_id} match={match}/>
                        ))}
                    </div>
                )}

                <div className="flex justify-center mt-10 mb-6"> {/* Increased top margin */}
                    <Link href={'/predictions/today'} passHref>
                        <Button
                            color="danger"
                            size="lg"
                            className="px-10 py-6 text-lg font-bold shadow-md hover:shadow-lg transition-shadow" // Adjusted padding and size
                            endContent={<ChevronRight />} // Added arrow icon
                        >
                            View All Predictions
                        </Button>
                    </Link>
                </div>

                {/* Stats Section (Optional - Uncomment if needed) */}
                {/*
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                        <div className="bg-red-100 p-3 rounded-lg"><Trophy className="w-6 h-6 text-red-600" /></div>
                        <div><p className="text-lg font-semibold text-gray-900">92%</p><p className="text-sm text-gray-500">Success Rate</p></div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                        <div className="bg-green-100 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-green-600" /></div>
                        <div><p className="text-lg font-semibold text-gray-900">+150</p><p className="text-sm text-gray-500">Daily Predictions</p></div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                         <div className="bg-yellow-100 p-3 rounded-lg"><Star className="w-6 h-6 text-yellow-600" /></div>
                         <div><p className="text-lg font-semibold text-gray-900">4.8/5</p><p className="text-sm text-gray-500">User Rating</p></div>
                    </div>
                </div>
                */}
            </div>
        </section>
    );
}