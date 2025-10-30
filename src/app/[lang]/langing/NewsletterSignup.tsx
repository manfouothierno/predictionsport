import { motion } from 'framer-motion';
import { Mail, ArrowRight, Bell, Star, TrendingUp, Shield } from 'lucide-react';
import { useState } from 'react';

export default function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Add newsletter submission logic
        setTimeout(() => setIsSubmitting(false), 1500);
    };

    const features = [
        {
            icon: Bell,
            title: 'Daily Predictions',
            description: 'Get expertly analyzed match predictions',
            color: 'red'
        },
        {
            icon: Star,
            title: 'VIP Tips',
            description: 'Exclusive access to premium predictions',
            color: 'yellow'
        },
        {
            icon: TrendingUp,
            title: 'Success Tracking',
            description: 'Monitor prediction performance',
            color: 'green'
        }
    ];

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-primary">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-800/50 text-red-200 text-sm font-medium mb-6 backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by 50,000+ Users
            </span>

                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Get Match Predictions That Actually Work
                        </h2>

                        <p className="text-xl text-red-100 mb-8 leading-relaxed">
                            Join our community of successful bettors receiving daily expert analysis, predictions, and exclusive insights.
                        </p>

                        <form onSubmit={handleSubmit} className="max-w-md mx-auto lg:mx-0">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-red-300" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:ring-2 focus:ring-red-400 bg-white/10 backdrop-blur-sm text-white placeholder-red-200 transition-all"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-red-900 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-lg shadow-red-900/20"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-red-900 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Subscribe
                                            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <p className="mt-4 text-sm text-red-200 flex items-center justify-center lg:justify-start">
                            <Shield className="w-4 h-4 mr-2" />
                            Your data is secure. Unsubscribe anytime.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-all"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${feature.color}-500/20`}>
                                        <feature.icon className={`w-6 h-6 text-${feature.color}-300`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-red-200 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-red-200">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white">92%</div>
                                <div className="text-sm text-red-200">Success Rate</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white">150+</div>
                                <div className="text-sm text-red-200">Daily Tips</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white">50K+</div>
                                <div className="text-sm text-red-200">Subscribers</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}