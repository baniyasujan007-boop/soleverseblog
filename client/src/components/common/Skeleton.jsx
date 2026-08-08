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
