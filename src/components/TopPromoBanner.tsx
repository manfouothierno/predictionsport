"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useUserCurrency } from "@/hooks/useUserCurrency";

const TopPromoBanner = () => {
  const { formattedBonus, loading, flag } = useUserCurrency();

  return (
    <div className="w-full fixed top-16 mb-4 z-40 font-sans">
      {/* DESKTOP */}
      <div className="hidden md:block">
        {/* White section */}
        <div className="w-full flex justify-center align-ce    bg-white ">
          <div className="w-full/2 border-1 border-gray-200 m-2 rounded  flex  self-center  gap-5 justify-around p-3 ">
            {/* Left side - flag and "Exclusive offer" */}
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">
                {loading ? "🇪🇺" : flag}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  Exclusive
                </p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  offer
                </p>
              </div>
            </div>

            {/* Center - 1xbet logo and bonus */}
            <div className="flex items-center gap-3">
              <div className="rounded-md flex items-center justify-center">
                <Image
                  src="/en/1xbet.jpg"
                  alt="1xbet logo"
                  width={70}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-1 text-gray-900">
                <span className="text-[15px]">Bonus up to</span>
                <span className="text-[#ff7f00] font-bold text-[18px]">
                  {loading ? "€390" : formattedBonus}
                </span>
              </div>
            </div>

            {/* Right - Orange button */}
            <a
              href="https://refpa58144.com/L?tag=d_4907789m_1599c_&site=4907789&ad=1599"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ff7f00] hover:bg-orange-600 transition-colors"
            >
              <ArrowRight className="text-white w-4 h-4" />
            </a>
          </div>

          {/* Subtext */}
          {/*<div className="text-center text-[11px] text-gray-500 pb-2">
            New customers only | Commercial content | 18+ age limit | T&Cs apply
          </div>*/}
        </div>

        {/* Blue section */}
        <div className="bg-[#003D7A]">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 py-2 text-white text-sm font-semibold">
            <div className="flex items-center justify-center w-5 h-5 bg-[#ff7f00] rounded-full">
              <span className="text-xs font-bold">!</span>
            </div>
            <span>
              1xbet Exclusive offer : Bonus {loading ? "€390" : formattedBonus}
            </span>
            <a
              href="https://refpa58144.com/L?tag=d_4907789m_1599c_&site=4907789&ad=1599"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-orange-300 transition-colors"
            >
              I want it
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        {/* White section */}
        <div className="bg-white border-b border-gray-200">
          <div className=" border-1 border-gray-200 m-2 rounded-lg  flex  mx-2 justify-center ">
            {/* Left side */}
            <div className="flex items-center gap-1.5">
              <span className="text-xl  leading-none">
                {loading ? "🇪🇺" : flag}
              </span>
              <div className="leading-tight">
                <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                  Exclusive
                </p>
                <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                  offer
                </p>
              </div>
            </div>

            {/* Center */}
            <div className="flex items-center gap-2">
              <div className=" px-3 py-1.5 rounded-md flex items-center justify-center">
                <Image
                  src="/en/1xbet.jpg"
                  alt="1xbet logo"
                  width={45}
                  height={18}
                  className="object-contain rounded-md"
                />
              </div>
              <div className=" leading-tight text-gray-900">
                <p className="text-[13px] font-bold">1xbet</p>
                <p>
                  <span className="text-[12px]">Bonus up to </span>
                  <span className="text-[#ff7f00] font-bold text-[14px]">
                    {loading ? "€390" : formattedBonus}
                  </span>
                </p>
              </div>
            </div>

            {/* Right button */}
            <a
              href="https://refpa58144.com/L?tag=d_4907789m_1599c_&site=4907789&ad=1599"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ff7f00] hover:bg-orange-600 transition-colors"
            >
              <ArrowRight className="text-white w-4 h-4" />
            </a>
          </div>

          {/* Subtext */}
          <div className="text-center text-[9px] text-gray-500 pb-1">
            New customers only | Commercial content | 18+ age limit | T&Cs apply
          </div>
        </div>

        {/* Blue section */}
        <div className="bg-[#003D7A]">
          <div className="flex items-center justify-center gap-1.5 py-2 text-white text-[11px] font-semibold flex-wrap">
            <div className="flex items-center justify-center w-4 h-4 bg-[#ff7f00] rounded-full">
              <span className="text-[9px] font-bold">!</span>
            </div>
            <span>
              1xbet Exclusive offer : Bonus {loading ? "€390" : formattedBonus}
            </span>
            <a
              href="https://refpa58144.com/L?tag=d_4907789m_1599c_&site=4907789&ad=1599"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-orange-300 transition-colors"
            >
              I want it
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPromoBanner;
