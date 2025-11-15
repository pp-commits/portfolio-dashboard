"use client";

import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";

// Fetcher function
const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data);

export function usePortfolio() {
  // SWR fetch pattern
  const { data, error, mutate, isLoading } = useSWR(
    "/api/portfolio",
    fetcher,
    {
      refreshInterval: 0,     // we handle interval manually
      revalidateOnFocus: true,
      dedupingInterval: 10000, // avoid duplicate refreshes
      revalidateIfStale: true,
    }
  );

  // Manual 15-second auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      mutate(); // triggers re-fetch from /api/portfolio
    }, 15000);

    return () => clearInterval(interval);
  }, [mutate]);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
