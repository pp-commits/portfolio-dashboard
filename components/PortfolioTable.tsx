
'use client';

import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { usePortfolio } from '@/lib/usePortfolio';
import { formatCurrency } from '@/lib/format';

// Sort arrow
function SortIndicator({ column }: { column: any }) {
  if (!column.isSorted) return <span className="opacity-40">↕</span>;
  return column.isSortedDesc ? <span>↓</span> : <span>↑</span>;
}

export default function PortfolioTable() {
  const { data, isLoading, error } = usePortfolio();
  const portfolio = data?.portfolio ?? [];

  // Columns
  const columns = useMemo(
    () => [
      {
        Header: 'Stock',
        accessor: 'name',
        Cell: ({ row }: any) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-gray-500">{row.original.symbol}</div>
          </div>
        ),
      },
      {
        Header: 'Qty',
        accessor: 'quantity',
      },
      {
        Header: 'Purchase',
        accessor: 'purchasePrice',
        Cell: ({ value }: any) => formatCurrency(value),
      },
      {
        Header: 'Investment',
        accessor: 'investment',
        Cell: ({ value }: any) => formatCurrency(value),
      },
      {
        Header: 'Portfolio %',
        accessor: 'portfolioPct',
        Cell: ({ value }: any) => `${value.toFixed(2)}%`,
      },
      {
        Header: 'Exchange',
        accessor: 'exchange',
      },
      {
        Header: 'CMP',
        accessor: 'cmp',
        Cell: ({ value }: any) => (value == null ? '—' : formatCurrency(value)),
      },
      {
        Header: 'Present Value',
        accessor: 'presentValue',
        Cell: ({ value }: any) => (value == null ? '—' : formatCurrency(value)),
      },
      {
        Header: 'Gain/Loss',
        accessor: 'gainLoss',
        Cell: ({ value }: any) => {
          if (value == null) return '—';
          const isGain = value >= 0;
          return (
            <span className={isGain ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {formatCurrency(value)}
            </span>
          );
        },
      },
      {
        Header: 'P/E',
        accessor: 'pe',
        Cell: ({ value }: any) => (value == null ? '—' : Number(value).toFixed(2)),
      },
      {
        Header: 'Earnings',
        accessor: 'latestEarnings',
        Cell: ({ value }: any) => value ?? '—',
      },
    ],
    []
  );

  // React Table instance
  const table = useTable(
    {
      columns: columns as any[],
      data: portfolio as any[],
      initialState: { sortBy: [{ id: 'investment', desc: true }] },
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = table;

  // Loading/Error states
  if (isLoading) return <div className="p-6 text-center">Loading portfolio...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Failed to load portfolio.</div>;
  if (!portfolio.length) return <div className="p-6 text-center">No holdings found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Holdings</h2>
        <p className="text-sm text-gray-500">
          Last updated:{' '}
          {data?.totals?.lastUpdated
            ? new Date(data.totals.lastUpdated).toLocaleTimeString()
            : '—'}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            {headerGroups.map((hg: any) => {
              const { key: hgKey, ...hgRest } = hg.getHeaderGroupProps();
              return (
                <tr key={hgKey} {...hgRest}>
                  {hg.headers.map((col: any) => {
                    const headerProps = col.getHeaderProps(col.getSortByToggleProps());
                    const { key: colKey, ...colRest } = headerProps;

                    return (
                      <th
                        key={colKey}
                        {...colRest}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        <div className="flex items-center gap-2">
                          <span>{col.render('Header')}</span>
                          <SortIndicator column={col} />
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row: any) => {
              prepareRow(row);

              const rowProps = row.getRowProps();
              const { key: rowKey, ...rowRest } = rowProps;

              const gain = row.original.gainLoss ?? 0;
              const hoverColor = gain >= 0 ? 'hover:bg-green-50' : 'hover:bg-red-50';

              return (
                <tr key={rowKey} {...rowRest} className={`transition-colors ${hoverColor}`}>
                  {row.cells.map((cell: any) => {
                    const cellProps = cell.getCellProps();
                    const { key: cellKey, ...cellRest } = cellProps;

                    return (
                      <td
                        key={cellKey}
                        {...cellRest}
                        className="px-4 py-3 border-b align-top"
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
