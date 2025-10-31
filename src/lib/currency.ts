// Currency conversion utility

export type CurrencyCode = 'XAF' | 'EUR' | 'USD' | 'GBP' | 'NGN' | 'GHS' | 'KES' | 'UGX' | 'TZS' | 'ZAR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate from XAF (base currency)
}

// Exchange rates from XAF (Central African CFA franc)
// Base amount: 260000 XAF
export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA franc',
    exchangeRate: 1,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRate: 0.0015, // 1 XAF ≈ 0.0015 EUR
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 0.0016, // 1 XAF ≈ 0.0016 USD
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    exchangeRate: 0.0013, // 1 XAF ≈ 0.0013 GBP
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    exchangeRate: 1.3, // 1 XAF ≈ 1.3 NGN
  },
  GHS: {
    code: 'GHS',
    symbol: '₵',
    name: 'Ghanaian Cedi',
    exchangeRate: 0.02, // 1 XAF ≈ 0.02 GHS
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    exchangeRate: 0.21, // 1 XAF ≈ 0.21 KES
  },
  UGX: {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    exchangeRate: 6.0, // 1 XAF ≈ 6.0 UGX
  },
  TZS: {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    exchangeRate: 4.0, // 1 XAF ≈ 4.0 TZS
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    exchangeRate: 0.03, // 1 XAF ≈ 0.03 ZAR
  },
};

// Country to currency mapping
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  // Central Africa
  CM: 'XAF', // Cameroon
  CF: 'XAF', // Central African Republic
  TD: 'XAF', // Chad
  CG: 'XAF', // Republic of Congo
  GQ: 'XAF', // Equatorial Guinea
  GA: 'XAF', // Gabon

  // Europe
  FR: 'EUR', // France
  DE: 'EUR', // Germany
  IT: 'EUR', // Italy
  ES: 'EUR', // Spain
  PT: 'EUR', // Portugal
  BE: 'EUR', // Belgium
  NL: 'EUR', // Netherlands
  AT: 'EUR', // Austria
  IE: 'EUR', // Ireland
  GR: 'EUR', // Greece
  FI: 'EUR', // Finland

  // UK
  GB: 'GBP', // United Kingdom

  // Americas
  US: 'USD', // United States
  CA: 'USD', // Canada (simplified)

  // Africa
  NG: 'NGN', // Nigeria
  GH: 'GHS', // Ghana
  KE: 'KES', // Kenya
  UG: 'UGX', // Uganda
  TZ: 'TZS', // Tanzania
  ZA: 'ZAR', // South Africa
};

/**
 * Convert XAF amount to target currency
 */
export function convertCurrency(amountInXAF: number, targetCurrency: CurrencyCode): number {
  const currency = CURRENCIES[targetCurrency];
  if (!currency) return amountInXAF;

  return Math.round(amountInXAF * currency.exchangeRate);
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES[currencyCode];
  if (!currency) return `${amount}`;

  // Format with commas for thousands
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // For some currencies, symbol comes after
  if (['XAF'].includes(currencyCode)) {
    return `${formattedAmount}${currency.symbol}`;
  }

  return `${currency.symbol}${formattedAmount}`;
}

/**
 * Get currency for a country code
 */
export function getCurrencyForCountry(countryCode: string): CurrencyCode {
  return COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()] || 'EUR';
}
