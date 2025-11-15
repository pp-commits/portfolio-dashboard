'use client';

import { useState } from 'react';
import PortfolioTable from '@/components/PortfolioTable';
import SectorSummary from '@/components/SectorSummary';
import ChartPortfolioPie from '@/components/ChartPortfolioPie';
import ChartSectorBar from '@/components/ChartSectorBar';
import { usePortfolio } from '@/lib/usePortfolio';

// Skeletons
import PortfolioTableSkeleton from '@/components/PortfolioTableSkeleton';
import SectorSummarySkeleton from '@/components/SectorSummarySkeleton';
import Skeleton from '@/components/Skeleton';

export default function Home() {
  const { data, isLoading, error } = usePortfolio();
  const [view, setView] = useState<'portfolio' | 'sectors'>('portfolio');

  // ---------- LOADING STATE ----------
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
        <div className="w-full max-w-6xl">

          {/* Title skeleton */}
          <Skeleton className="h-10 w-80 mx-auto mb-10" />

          {/* Summary card skeleton */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>

          {/* Toggle skeleton */}
          <div className="flex justify-center gap-4 mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Table or Sector Summary skeleton */}
          <div className="mt-4 mb-10">
            {view === 'portfolio' ? (
              <PortfolioTableSkeleton />
            ) : (
              <SectorSummarySkeleton />
            )}
          </div>

          {/* Chart skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>

        </div>
      </main>
    );
  }

  // ---------- ERROR STATE ----------
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        Failed to fetch data.
      </main>
    );
  }

  // ---------- DATA LOADED ----------
  const { totals, portfolio, sectors } = data;

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight text-gray-900">
          Dynamic Portfolio Dashboard
        </h1>

        {/* SUMMARY CARD */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 text-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Investment</p>
              <p className="text-xl font-semibold text-gray-800">
                ₹{totals.totalInvestment.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Present Value</p>
              <p className="text-xl font-semibold text-gray-800">
                ₹{totals.totalPresent.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-xl font-semibold text-gray-800">
                {new Date(totals.lastUpdated).toLocaleTimeString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* TOGGLE BUTTONS */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setView('portfolio')}
            className={`px-5 py-2 rounded-lg text-sm font-medium shadow 
              ${view === 'portfolio' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Holdings
          </button>

          <button
            onClick={() => setView('sectors')}
            className={`px-5 py-2 rounded-lg text-sm font-medium shadow 
              ${view === 'sectors' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Sector Summary
          </button>
        </div>

        {/* TABLE / SECTOR SUMMARY */}
        <div className="mt-4 mb-10">
          {view === 'portfolio' ? (
            <PortfolioTable />
          ) : (
            <SectorSummary sectors={sectors} />
          )}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <ChartPortfolioPie data={portfolio} />
          <ChartSectorBar sectors={sectors} />
        </div>

      </div>
    </main>
  );
}
