import { motion } from 'framer-motion';
import Image from 'next/image';

const leagues = [
    {
        id: 1,
        name: 'Premier League',
        country: 'England',
        logo: '/leagues/premier-league.svg',
        matches: 8,
        predictions: 16
    },
    {
        id: 2,
        name: 'La Liga',
        country: 'Spain',
        logo: '/leagues/la-liga.svg',
        matches: 6,
        predictions: 12
    },
    // Add more leagues
];

export default function PopularLeagues() {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Leagues</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {leagues.map((league) => (
                        <motion.div
                            key={league.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="group bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 relative flex-shrink-0">
                                    <Image
                                        src={league.logo}
                                        alt={league.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                                        {league.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{league.country}</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
                                <div className="bg-gray-50 rounded-lg py-2">
                                    <p className="font-medium text-gray-900">{league.matches}</p>
                                    <p className="text-gray-500">Matches</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg py-2">
                                    <p className="font-medium text-gray-900">{league.predictions}</p>
                                    <p className="text-gray-500">Tips</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick filters */}
                <div className="mt-8 flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                    <button className="flex-shrink-0 bg-red-600 text-white px-4 py-2 rounded-full">
                        All Leagues
                    </button>
                    <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200">
                        Top 5
                    </button>
                    <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200">
                        Champions League
                    </button>
                    <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200">
                        Europa League
                    </button>
                </div>
            </div>
        </section>
    );
}