
'use client';

import React from 'react';
import { formatCurrency } from '@/lib/format';

type Sector = {
  items: any[];
  totalInvestment: number;
  totalPresent: number;
  totalGainLoss: number;
};

export default function SectorSummary({ sectors }: { sectors: Record<string, Sector> }) {
  if (!sectors || Object.keys(sectors).length === 0) {
    return <div className="p-4 text-gray-600">No sector data</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(sectors).map(([name, s]) => {
        const isPositive = s.totalGainLoss >= 0;
        return (
          <div key={name} className="card card-hover">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{name}</h3>
              <div className="text-sm text-gray-500">{s.items.length} stocks</div>
            </div>
            <div className="mt-3 text-sm text-gray-700">
              <div>Investment: {formatCurrency(s.totalInvestment)}</div>
              <div>Present: {formatCurrency(s.totalPresent)}</div>
              <div className={`mt-2 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                Gain/Loss: {formatCurrency(s.totalGainLoss)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
