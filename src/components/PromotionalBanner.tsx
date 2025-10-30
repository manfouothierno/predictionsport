import React from 'react';
import { ArrowRight, Gift, Star } from 'lucide-react';
import Image from 'next/image';

interface PromotionalBannerProps {
  brand: '1xbet' | 'melbet' | 'linebet';
  brandLogo: string;
  promoUrl: string;
  bonus?: string;
}

const PromotionalBanner = ({ brand, brandLogo, promoUrl, bonus }: PromotionalBannerProps) => {
    const brandConfigs = {
        '1xbet': {
            bgColor: 'bg-blue-900',
            hoverBgColor: 'hover:bg-blue-800',
            textColor: 'text-white',
            accentColor: 'bg-orange-500',
            accentText: 'text-orange-500',
            borderAccent: 'border-orange-500',
            bonus: '50,000 FCFA',
            icon: Gift
        },
        'melbet': {
            bgColor: 'bg-green-900',
            hoverBgColor: 'hover:bg-green-800',
            textColor: 'text-white',
            accentColor: 'bg-yellow-500',
            accentText: 'text-yellow-500',
            borderAccent: 'border-yellow-500',
            bonus: '45,000 FCFA',
            icon: Star
        },
        'linebet': {
            bgColor: 'bg-purple-900',
            hoverBgColor: 'hover:bg-purple-800',
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
        <div className="group relative w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
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
                className={`block ${config.bgColor} ${config.hoverBgColor} transition-all duration-300`}
            >
                <div className="relative p-4 sm:p-6">
                    {/* Content wrapper */}
                    <div className="flex items-center justify-between ">
                        {/* Left section */}
                        <div className="flex items-center space-x-4 ">
                            <div className="relative w-20 h-8">
                                <Image
                                    src={brandLogo}
                                    alt={`${brand} logo`}
                                    fill
                                    className="object-contain"
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