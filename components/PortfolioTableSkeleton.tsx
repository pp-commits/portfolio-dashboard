
import Skeleton from "./Skeleton";

export default function PortfolioTableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {Array.from({ length: 11 }).map((_, i) => (
                <th key={i} className="p-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b">
                {Array.from({ length: 11 }).map((_, cellIdx) => (
                  <td key={cellIdx} className="p-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
