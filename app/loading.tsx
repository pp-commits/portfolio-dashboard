
import Skeleton from "@/components/Skeleton";

export default function LoadingPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">

        <Skeleton className="h-10 w-80 mx-auto mb-10" />

        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </main>
  );
}
