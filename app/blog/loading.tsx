import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </div>

      {/* Search and Categories Skeleton */}
      <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Skeleton className="h-10 w-full md:w-1/3" />
        <Skeleton className="h-10 w-full md:w-1/3" />
      </div>

      {/* Featured Article Skeleton */}
      <div className="mb-12">
        <div className="overflow-hidden rounded-lg border">
          <div className="grid md:grid-cols-2">
            <Skeleton className="h-64 w-full md:h-96" />
            <div className="p-6 md:p-8">
              <Skeleton className="mb-4 h-4 w-32" />
              <Skeleton className="mb-4 h-8 w-full" />
              <Skeleton className="mb-4 h-24 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Articles Skeleton */}
      <div className="mb-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="mb-4 h-6 w-full" />
                <Skeleton className="mb-4 h-16 w-full" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Articles Skeleton */}
      <div className="mb-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <div className="grid md:grid-cols-4">
                <Skeleton className="h-48 w-full md:h-full" />
                <div className="p-6 md:col-span-3">
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="mb-4 h-6 w-full" />
                  <Skeleton className="mb-4 h-16 w-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup Skeleton */}
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}
