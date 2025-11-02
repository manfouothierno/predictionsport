"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useUserCurrency } from "@/hooks/useUserCurrency";

const TopPromoBanner = () => {
  const { formattedBonus, loading } = useUserCurrency();
  return (
    <div className="w-full fixed top-16 z-40 shadow-md">
      {/* Desktop Banner */}
      <div className="hidden md:block">
        {/* Top Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left - Exclusive Offer */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Exclusive
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    offer
                  </div>
                </div>
              </div>

              {/* Center - 1xbet Logo and Bonus */}
              <div className="flex items-center space-x-3">
                <div className=" px-3 py-1.5 rounded flex items-center">
                  <Image
                    src="/en/1xbet.jpg"
                    alt="1xbet logo"
                    width={80}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <div className="text-gray-900">
                  <span className="text-base font-medium">Bonus up to </span>
                  <span className="text-orange-500 font-bold text-lg">
                    {loading ? "€390" : formattedBonus}
                  </span>
                </div>
              </div>

              {/* Right - Arrow Button */}
              <a
                href="https://1xbet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Blue Bar */}
        <div className="bg-[#1a4d8f] text-white">
          <div className="max-w-7xl mx-auto px-4 py-1.5 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className="font-medium">
                1xbet Exclusive offer : Bonus{" "}
                {loading ? "€390" : formattedBonus}
              </span>
              <span className="text-gray-300">|</span>
              <a
                href="https://1xbet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 font-semibold underline transition-colors"
              >
                I want it
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="md:hidden">
        {/* Top Section - Compact */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-3 py-2">
            <div className="flex items-center justify-between">
              {/* Left - Exclusive Offer Badge */}
              <div className="flex items-center space-x-1.5">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-gray-900 leading-tight">
                    Exclusive
                  </div>
                  <div className="font-semibold text-gray-900 leading-tight">
                    offer
                  </div>
                </div>
              </div>

              {/* Center - 1xbet Logo and Bonus */}
              <div className="flex items-center space-x-2">
                <div className=" px-2 py-1 rounded flex items-center">
                  <Image
                    src="/en/1xbet.jpg"
                    alt="1xbet logo"
                    width={30}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="text-xs">
                  <div className="text-gray-700">Bonus up to</div>
                  <div className="text-orange-500 font-bold">
                    {loading ? "€390" : formattedBonus}
                  </div>
                </div>
              </div>

              {/* Right - Arrow Button */}
              <a
                href="https://1xbet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Blue Bar - Compact */}
        <div className="bg-[#1a4d8f] text-white">
          <div className="px-3 py-1.5 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-xs">
              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">!</span>
              </div>
              <span className="font-medium">
                1xbet Exclusive offer : Bonus{" "}
                {loading ? "€390" : formattedBonus}
              </span>
              <span className="text-gray-300">|</span>
              <a
                href="https://1xbet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 font-semibold underline transition-colors"
              >
                I want it
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPromoBanner;
