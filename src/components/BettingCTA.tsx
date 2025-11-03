"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useUserCurrency } from "@/hooks/useUserCurrency";

interface BettingCTAProps {
  matchTitle?: string;
  className?: string;
}

const BettingCTA = ({ matchTitle, className = "" }: BettingCTAProps) => {
  const { formattedBonus, loading } = useUserCurrency();

  return (
    <div className={` rounded-xl shadow-sm p-6 ${className}`}>
      {/* Match Title */}
      {matchTitle && (
        <h3 className="text-white bg-yellow-600 rounded-xl text-lg font-bold text-center mb-4">
          {matchTitle}
        </h3>
      )}

      {/* BET NOW Button */}
      <a
        href="https://refpa58144.com/L?tag=d_4907789m_1599c_&site=4907789&ad=1599"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center justify-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-3 bg-primary hover:bg-primary-800 text-white font-bold text-sm md:text-base rounded-full transition-all shadow-md hover:shadow-lg"
      >
        <ExternalLink className="w-5 h-5 text-white" />
        <span>{"BET NOW!"}</span>
        <div className="">
          <Image
            src="/en/1xbet-mini.jpeg"
            alt="1xbet"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
      </a>

      {/* Bonus Offer Text */}
      <div className="text-center">
        <p className="text-orange-400 font-bold text-xl">
          {loading
            ? "260000XAF"
            : formattedBonus.replace(/[^0-9]/g, "") +
              formattedBonus.replace(/[0-9.,]/g, "")}{" "}
          offered for betting!
        </p>
      </div>
    </div>
  );
};

export default BettingCTA;
