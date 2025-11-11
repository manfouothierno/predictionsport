"use client";

import { useState, useEffect } from "react";
import { GeolocationData } from "@/types/database";

interface NewsletterGeolocationResult {
  data: GeolocationData | null;
  loading: boolean;
  error: Error | null;
}

export const useNewsletterGeolocation = (): NewsletterGeolocationResult => {
  const [data, setData] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGeolocation = async () => {
      try {
        // Fetch IP-based geolocation data
        const response = await fetch("https://ipapi.co/json/");

        if (!response.ok) {
          throw new Error("Failed to fetch geolocation data");
        }

        const apiData = await response.json();

        // Get browser timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Combine all data
        const geolocationData: GeolocationData = {
          country_code: apiData.country_code || apiData.country || "",
          country_name: apiData.country_name || "",
          city: apiData.city || "",
          timezone: timezone || "",
          ip: apiData.ip || "",
        };

        setData(geolocationData);
        setError(null);
      } catch (err) {
        console.error("Error fetching geolocation:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));

        // Set fallback data with at least timezone
        const fallbackData: GeolocationData = {
          country_code: "",
          country_name: "",
          city: "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
          ip: "",
        };
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchGeolocation();
  }, []);

  return {
    data,
    loading,
    error,
  };
};
