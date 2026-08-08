export function DealGridSkeleton({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded border border-black/10 bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-black/10" />
          <div className="space-y-3 p-4">
            <div className="h-2.5 w-16 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-black/10" />
            <div className="mt-2 flex items-center gap-2">
              <div className="h-6 w-20 animate-pulse rounded bg-black/10" />
              <div className="h-4 w-12 animate-pulse rounded bg-black/10" />
            </div>
            <div className="mt-2 h-8 w-full animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReleaseGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded border border-black/10 bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-black/10" />
          <div className="space-y-3 p-4">
            <div className="h-2.5 w-16 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded border border-black/10 bg-white"
        >
          <div className="relative aspect-[4/3] animate-pulse bg-black/10">
            <div className="absolute right-3 top-3 h-12 w-12 animate-pulse rounded-full bg-black/20" />
          </div>
          <div className="space-y-3 p-4">
            <div className="h-2.5 w-16 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-black/10" />
            <div className="mt-2 h-8 w-full animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BrandGridSkeleton({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded border border-black/10 bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-black/10" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-full animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GuideGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded border border-black/10 bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-black/10" />
          <div className="space-y-3 p-4">
            <div className="h-2.5 w-16 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-full animate-pulse rounded bg-black/10" />
            <div className="mt-2 h-8 w-full animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CalendarGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded border border-black/10 bg-white"
        >
          <div className="relative aspect-[4/3] animate-pulse bg-black/10">
            <div className="absolute right-3 top-3 h-12 w-12 animate-pulse rounded bg-black/20" />
          </div>
          <div className="space-y-3 p-4">
            <div className="h-2.5 w-16 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-black/10" />
            <div className="mt-2 h-8 w-full animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CalendarMonthSkeleton() {
  return (
    <div className="overflow-hidden rounded border border-black/10 bg-white" aria-hidden="true">
      <div className="grid grid-cols-7 border-b border-black/10">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="h-10 animate-pulse bg-black/5" />
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 35 }, (_, index) => (
          <div key={index} className="aspect-[4/5] animate-pulse border-r border-b border-black/5 bg-white" />
        ))}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
