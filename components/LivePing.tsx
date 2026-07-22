export function LivePing() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wc-green opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-wc-green" />
    </span>
  )
}
