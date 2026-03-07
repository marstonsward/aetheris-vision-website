export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
