import React from 'react';
import { ArrowRight, Gift, Star } from 'lucide-react';

 const PromotionalBanner = ({ brand, brandLogo, promoUrl, bonus }) => {
    const brandConfigs = {
        '1xbet': {
            bgGradient: 'bg-gradient-to-r from-blue-900 to-blue-800',
            hoverGradient: 'hover:from-blue-800 hover:to-blue-700',
            textColor: 'text-white',
            accentColor: 'bg-orange-500',
            accentText: 'text-orange-500',
            borderAccent: 'border-orange-500',
            bonus: '50,000 FCFA',
            icon: Gift
        },
        'melbet': {
            bgGradient: 'bg-gradient-to-r from-green-900 to-green-800',
            hoverGradient: 'hover:from-green-800 hover:to-green-700',
            textColor: 'text-white',
            accentColor: 'bg-yellow-500',
            accentText: 'text-yellow-500',
            borderAccent: 'border-yellow-500',
            bonus: '45,000 FCFA',
            icon: Star
        },
        'linebet': {
            bgGradient: 'bg-gradient-to-r from-purple-900 to-purple-800',
            hoverGradient: 'hover:from-purple-800 hover:to-purple-700',
            textColor: 'text-white',
            accentColor: 'bg-pink-500',
            accentText: 'text-pink-500',
            borderAccent: 'border-pink-500',
            bonus: '40,000 FCFA',
            icon: Gift
        }
    };

    const config = brandConfigs[brand];
    const Icon = config.icon;

    return (
        <div className="group relative w-full  overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
            {/* Hot badge */}
            <div className="absolute -right-12 top-6 rotate-45 z-10">
                <div className={`${config.accentColor} py-1 px-12`}>
                    <span className="text-white text-xs font-bold tracking-wider">HOT BONUS</span>
                </div>
            </div>

            <a
                href={promoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block ${config.bgGradient} ${config.hoverGradient} transition-all duration-300`}
            >
                <div className="relative p-4 sm:p-6">
                    {/* Content wrapper */}
                    <div className="flex items-center justify-between ">
                        {/* Left section */}
                        <div className="flex items-center space-x-4 ">
                            <div className={`w-18 h-6`}>
                                {/*<div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>*/}
                                <img
                                    src={brandLogo}
                                    alt={`${brand} logo`}
                                    className=" w-16 h-4 "
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className={`${config.textColor} text-lg sm:text-xl font-bold mb-1`}>
                                    {brand.toUpperCase()}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <Icon className={`${config.accentText} w-4 h-4`} />
                                    <p className={`${config.textColor} text-sm sm:text-base opacity-90`}>
                                        Welcome Bonus up to {config.bonus}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right section - CTA */}
                        <div className="flex items-center ml-2">
                            <div className={`
                flex items-center space-x-1 px-4 py-2 rounded-lg 
                border-2 ${config.borderAccent} ${config.textColor}
                transition-all duration-300
                
              `}>
                                <span className="text-sm font-bold whitespace-nowrap">Claim Now</span>
                                {/*<ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />*/}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default PromotionalBanner;