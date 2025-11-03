"use client";

import { useState, useEffect } from "react";

interface CountryBonusConfig {
  currency: string;
  amount: number;
  countryCode: string;
  flag: string;
}

const bonusConfig: Record<string, CountryBonusConfig> = {
  XAF: { currency: "XAF", amount: 260000, countryCode: "CM", flag: "🇨🇲" }, // Cameroon
  EUR: { currency: "EUR", amount: 390, countryCode: "FR", flag: "🇪🇺" }, // Europe
  USD: { currency: "USD", amount: 430, countryCode: "US", flag: "🇺🇸" }, // USA
  GBP: { currency: "GBP", amount: 350, countryCode: "GB", flag: "🇬🇧" }, // UK
  NGN: { currency: "NGN", amount: 350000, countryCode: "NG", flag: "🇳🇬" }, // Nigeria
  GHS: { currency: "GHS", amount: 5000, countryCode: "GH", flag: "🇬🇭" }, // Ghana
  KES: { currency: "KES", amount: 50000, countryCode: "KE", flag: "🇰🇪" }, // Kenya
  ZAR: { currency: "ZAR", amount: 7000, countryCode: "ZA", flag: "🇿🇦" }, // South Africa
  MAD: { currency: "MAD", amount: 4000, countryCode: "MA", flag: "🇲🇦" }, // Morocco
  TND: { currency: "TND", amount: 1200, countryCode: "TN", flag: "🇹🇳" }, // Tunisia
  EGP: { currency: "EGP", amount: 12000, countryCode: "EG", flag: "🇪🇬" }, // Egypt
};

export const useUserCurrency = () => {
  const [bonusData, setBonusData] = useState<CountryBonusConfig>(
    bonusConfig.XAF, // Default to XAF for African markets
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        // Try multiple geolocation APIs with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to fetch location");
        }

        const data = await response.json();
        const userCurrency = data.currency || "XAF";

        // Get bonus config for user's currency, fallback to XAF
        const config = bonusConfig[userCurrency] || bonusConfig.XAF;
        setBonusData(config);
      } catch (error) {
        // Silently fallback to XAF (Cameroon) for development/errors
        console.warn("Using default location (Cameroon):", error);
        setBonusData(bonusConfig.XAF);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  const formattedBonus = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: bonusData.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(bonusData.amount);

  return {
    formattedBonus,
    loading,
    currency: bonusData.currency,
    amount: bonusData.amount,
    countryCode: bonusData.countryCode,
    flag: bonusData.flag,
  };
};
