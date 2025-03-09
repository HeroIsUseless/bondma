import { Skeleton } from "@/components/ui/skeleton";

export function LoadingTeamsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="flex justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
