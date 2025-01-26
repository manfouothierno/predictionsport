import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Trophy, TrendingUp } from 'lucide-react';

const mockMatches = [
    {
        id: 1,
        league: 'Premier League',
        homeTeam: 'Arsenal',
        awayTeam: 'Manchester City',
        time: '20:45',
        homeScore: 2,
        awayScore: 1,
        minute: '63',
        prediction: 'Home Win',
        confidence: 85,
        odds: '1.95'
    },
    // Add more mock matches
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
};

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentSlide((prev) =>
            (prev + newDirection + mockMatches.length) % mockMatches.length
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    return (
        <section className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Hero Content */}
                    <div className="lg:col-span-5 space-y-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
              <span className="inline-block px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                Live Predictions
              </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                Expert Football Predictions & Analysis
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-300 max-w-xl">
                                Get real-time match predictions powered by advanced analytics and expert insights. Stay ahead of the game with our accurate forecasting.
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-3 gap-6 pt-8"
                        >
                            <div className="text-center">
                                <div className="bg-white/10 rounded-lg p-4">
                                    <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">98%</p>
                                    <p className="text-sm text-gray-300">On-time</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="bg-white/10 rounded-lg p-4">
                                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">85%</p>
                                    <p className="text-sm text-gray-300">Accuracy</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="bg-white/10 rounded-lg p-4">
                                    <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">50K+</p>
                                    <p className="text-sm text-gray-300">Users</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Live Matches Carousel */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative h-[400px] sm:h-[450px]">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentSlide}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="absolute w-full"
                                >
                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                                        <div className="flex flex-col space-y-6">
                                            {/* Header */}
                                            <div className="flex justify-between items-center">
                                                <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                            LIVE
                          </span>
                                                    <h3 className="text-white mt-2 text-lg font-medium">
                                                        {mockMatches[currentSlide].league}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-400 text-sm">Match Time</p>
                                                    <p className="text-white font-medium">{mockMatches[currentSlide].time}</p>
                                                </div>
                                            </div>

                                            {/* Score */}
                                            <div className="flex justify-between items-center py-6 border-y border-white/10">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                                                        <p className="text-xl font-bold text-white">{mockMatches[currentSlide].homeTeam}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                                                        <p className="text-xl font-bold text-white">{mockMatches[currentSlide].awayTeam}</p>
                                                    </div>
                                                </div>
                                                <div className="text-center px-8">
                                                    <div className="text-5xl font-bold text-white tracking-tight">
                                                        {mockMatches[currentSlide].homeScore}
                                                        <span className="mx-3 text-gray-400">-</span>
                                                        {mockMatches[currentSlide].awayScore}
                                                    </div>
                                                    <div className="text-green-400 text-lg mt-2">
                                                        {mockMatches[currentSlide].minute}'
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Prediction */}
                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="text-center">
                                                    <p className="text-gray-400 text-sm mb-1">Prediction</p>
                                                    <p className="text-white font-medium">{mockMatches[currentSlide].prediction}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-gray-400 text-sm mb-1">Confidence</p>
                                                    <p className="text-white font-medium">{mockMatches[currentSlide].confidence}%</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-gray-400 text-sm mb-1">Best Odds</p>
                                                    <p className="text-white font-medium">{mockMatches[currentSlide].odds}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                            <button
                                onClick={() => paginate(-1)}
                                className="bg-white/10 hover:bg-white/20 transition-colors rounded-full p-3 text-white backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => paginate(1)}
                                className="bg-white/10 hover:bg-white/20 transition-colors rounded-full p-3 text-white backdrop-blur-sm"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Indicators */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {mockMatches.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        currentSlide === index ? 'bg-white' : 'bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}