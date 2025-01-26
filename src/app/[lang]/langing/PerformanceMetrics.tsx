import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, XCircle, Activity, ChevronDown, Filter, Calendar, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockData = {
    weeklySuccess: [
        { day: 'Mon', rate: 85, predictions: 32 },
        { day: 'Tue', rate: 88, predictions: 45 },
        { day: 'Wed', rate: 92, predictions: 38 },
        { day: 'Thu', rate: 87, predictions: 41 },
        { day: 'Fri', rate: 90, predictions: 36 },
        { day: 'Sat', rate: 89, predictions: 44 },
        { day: 'Sun', rate: 91, predictions: 39 }
    ],
    leagues: [
        { name: 'Premier League', accuracy: 92 },
        { name: 'La Liga', accuracy: 88 },
        { name: 'Bundesliga', accuracy: 87 },
        { name: 'Serie A', accuracy: 89 }
    ],
    recentPredictions: [
        {
            id: 1,
            match: 'Arsenal vs Chelsea',
            prediction: 'Home Win',
            result: 'success',
            odds: 1.85,
            profit: '+0.85',
            time: '2h ago'
        },
        {
            id: 2,
            match: 'Manchester City vs Chelsea',
            prediction: 'Home Win',
            result: 'success',
            odds: 1.85,
            profit: '+0.85',
            time: '2h ago'
        },
        {
            id: 3,
            match: 'Manchester City vs Chelsea',
            prediction: 'Home Win',
            result: 'success',
            odds: 1.85,
            profit: '+0.85',
            time: '2h ago'
        },
        {
            id: 4,
            match: 'Manchester City vs Chelsea',
            prediction: 'Home Win',
            result: 'success',
            odds: 1.85,
            profit: '+0.85',
            time: '2h ago'
        },
        // Add more predictions
    ]
};

const CustomTooltip = ({ active=false, payload = [] as any, label='' }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-blue-600">{`Success Rate: ${payload[0].value}%`}</p>
                <p className="text-gray-600">{`Predictions: ${payload[0].payload.predictions}`}</p>
            </div>
        );
    }
    return null;
};

export default function PerformanceMetrics() {
    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Performance Analytics</h2>
                        <p className="mt-2 text-gray-600">Detailed insights into our prediction accuracy</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                        <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Calendar className="w-4 h-4 mr-2" />
                            Date Range
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Stats Overview */}
                    <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-400/30 rounded-lg p-2">
                                    <Activity className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-blue-100 text-sm">Overall Success Rate</p>
                            <h3 className="text-3xl font-bold mt-1">89.5%</h3>
                            <div className="mt-4 flex items-center text-blue-100 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>+2.5% from last month</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                        >
                            <p className="text-gray-500 text-sm">Total Predictions</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">1,458</h3>
                            <div className="mt-4 flex items-center text-gray-500 text-sm">
                                <span>Last 30 days</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                        >
                            <p className="text-gray-500 text-sm">Successful Predictions</p>
                            <h3 className="text-2xl font-bold text-green-600 mt-1">1,289</h3>
                            <div className="mt-4 flex items-center text-gray-500 text-sm">
                                <span>88.4% success rate</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                        >
                            <p className="text-gray-500 text-sm">Average Odds</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">1.95</h3>
                            <div className="mt-4 flex items-center text-green-600 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>+0.15 this week</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Success Rate Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Success Rate Trend</h3>
                                <p className="text-sm text-gray-500 mt-1">Daily prediction performance</p>
                            </div>
                            <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 pr-8">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                            </select>
                        </div>

                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockData.weeklySuccess}>
                                    <defs>
                                        <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        fill="url(#rateGradient)"
                                        dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4, fill: 'white' }}
                                        activeDot={{ r: 6, fill: '#3B82F6' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* League Performance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">League Performance</h3>
                        <div className="space-y-6">
                            {mockData.leagues.map((league) => (
                                <div key={league.name} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">{league.name}</span>
                                        <span className="text-sm font-medium text-gray-900">{league.accuracy}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-500 group-hover:bg-blue-600"
                                            style={{ width: `${league.accuracy}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Predictions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="lg:col-span-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Recent Predictions</h3>
                                <p className="text-sm text-gray-500 mt-1">Latest prediction results and outcomes</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
                                View All
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {mockData.recentPredictions.map((prediction) => (
                                    <tr key={prediction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prediction.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{prediction.match}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prediction.prediction}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {prediction.result === 'success' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Success
                          </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Failed
                          </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prediction.odds}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                            prediction.profit.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {prediction.profit}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}