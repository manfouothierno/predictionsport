import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone, ArrowRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Youtube, href: '#', label: 'Youtube' }
    ];

    const quickLinks = [
        { name: 'Today\'s Predictions', href: '#' },
        { name: 'Live Scores', href: '#' },
        { name: 'Statistics', href: '#' },
        { name: 'News', href: '#' },
        { name: 'VIP Predictions', href: '#', badge: 'New' }
    ];

    const leagues = [
        { name: 'Premier League', country: 'England', href: '#' },
        { name: 'La Liga', country: 'Spain', href: '#' },
        { name: 'Bundesliga', country: 'Germany', href: '#' },
        { name: 'Serie A', country: 'Italy', href: '#' },
        { name: 'Champions League', country: 'Europe', href: '#' }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black">

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-4 space-y-6">
                        <div>
                            <h2 className="text-white text-2xl font-bold">PredictionSport</h2>
                            <p className="text-gray-400 mt-4 leading-relaxed">
                                Your trusted source for expert football predictions and analysis. Join our community of successful bettors.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Globe className="w-5 h-5 text-blue-500" />
                                <span>Available in 4 languages</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <span>Coverage of 30+ leagues</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <span>24/7 Customer support</span>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="group flex items-center text-gray-400 hover:text-white transition-colors">
                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                        <span>{link.name}</span>
                                        {link.badge && (
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                        {link.badge}
                      </span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Leagues */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-semibold mb-6">Top Leagues</h3>
                        <ul className="space-y-3">
                            {leagues.map((league) => (
                                <li key={league.name}>
                                    <a href={league.href} className="group flex items-center text-gray-400 hover:text-white transition-colors">
                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                        <span>{league.name}</span>
                                        <span className="ml-2 text-sm text-gray-500">({league.country})</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <div className="space-y-6">
                            <a
                                href="mailto:support@predictionsport.com"
                                className="flex items-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Mail className="w-5 h-5 mr-2" />
                                support@predictionsport.com
                            </a>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
                                Live Chat Support
                            </button>
                            <p className="text-sm text-gray-500">
                                Available 24/7 for any queries or assistance
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400 text-sm">
                            © {currentYear} PredictionSport. All rights reserved.
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Responsible Gaming'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-gray-400 hover:text-white text-sm transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;