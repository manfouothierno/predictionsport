import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Star } from 'lucide-react';

const mockPredictions = [
    {
        id: 1,
        league: 'Premier League',
        match: 'Liverpool vs Chelsea',
        time: '20:45',
        prediction: 'Home Win',
        confidence: 85,
        odds: 1.95,
        status: 'hot'
    },

    {
        id: 2,
        league: 'Premier League',
        match: 'Liverpool vs Chelsea',
        time: '20:45',
        prediction: 'Home Win',
        confidence: 85,
        odds: 1.95,
        status: 'hot'
    },
    {
        id: 3,
        league: 'Premier League',
        match: 'Liverpool vs Chelsea',
        time: '20:45',
        prediction: 'Home Win',
        confidence: 85,
        odds: 1.95,
        status: 'hot'
    },
    // Add more predictions
];

export default function TopPredictions() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Top Predictions
                        </h2>
                        <p className="mt-2 text-gray-600">Expert picks with highest confidence</p>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        View All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockPredictions.map((prediction) => (
                        <motion.div
                            key={prediction.id}
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
                                            {prediction.match}
                                        </h3>
                                        <p className="text-sm text-gray-500">{prediction.league}</p>
                                    </div>
                                    {prediction.status === 'hot' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      HOT
                    </span>
                                    )}
                                </div>

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${prediction.confidence}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                    {prediction.confidence}%
                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Time</p>
                                        <p className="font-medium">{prediction.time}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Prediction</p>
                                        <p className="font-medium">{prediction.prediction}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Odds</p>
                                        <p className="font-medium">{prediction.odds}</p>
                                    </div>
                                </div>

                                <button className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all">
                                    View Analysis
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

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