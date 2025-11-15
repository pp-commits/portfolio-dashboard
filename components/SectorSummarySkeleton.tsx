
import Skeleton from "./Skeleton";

export default function SectorSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-10" />
          </div>

          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
