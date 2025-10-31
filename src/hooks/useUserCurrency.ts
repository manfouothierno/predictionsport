'use client';

import { useState, useEffect } from 'react';
import { CurrencyCode, getCurrencyForCountry, convertCurrency, formatCurrency } from '@/lib/currency';

interface UserCurrencyData {
  currencyCode: CurrencyCode;
  bonusAmount: number;
  formattedBonus: string;
  countryCode: string | null;
  loading: boolean;
}

const BASE_BONUS_XAF = 260000; // Base bonus in XAF

/**
 * Hook to detect user's location and provide localized currency
 */
export function useUserCurrency(): UserCurrencyData {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectLocation() {
      try {
        // Try to get location from localStorage first (cache)
        const cachedCountry = localStorage.getItem('user_country');

        if (cachedCountry) {
          setCountryCode(cachedCountry);
          setLoading(false);
          return;
        }

        // Use ipapi.co for free IP geolocation (100 requests per day free)
        const response = await fetch('https://ipapi.co/json/', {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const detectedCountry = data.country_code || 'FR'; // Default to France (EUR)

          setCountryCode(detectedCountry);

          // Cache for 24 hours
          localStorage.setItem('user_country', detectedCountry);
        } else {
          // Fallback to default
          setCountryCode('FR');
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback to France (EUR)
        setCountryCode('FR');
      } finally {
        setLoading(false);
      }
    }

    detectLocation();
  }, []);

  // Calculate currency info
  const currencyCode = countryCode ? getCurrencyForCountry(countryCode) : 'EUR';
  const bonusAmount = convertCurrency(BASE_BONUS_XAF, currencyCode);
  const formattedBonus = formatCurrency(bonusAmount, currencyCode);

  return {
    currencyCode,
    bonusAmount,
    formattedBonus,
    countryCode,
    loading,
  };
}
