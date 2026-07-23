export function SkeletonCard() {
  return (
    <div className="skeleton-card cat-glass p-4 flex items-start gap-3">
      <div className="skeleton-pulse skeleton-avatar shrink-0" />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <div className="skeleton-pulse skeleton-line w-3/4" />
        <div className="skeleton-pulse skeleton-line w-1/2" />
      </div>
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-pulse ${className}`} />
}
