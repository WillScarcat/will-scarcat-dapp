export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-16 px-4">
      <div
        className="h-px flex-1"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08))' }}
      />
      <span
        className="text-[10px] font-bold tracking-[0.3em] uppercase shrink-0"
        style={{ color: 'rgba(204,255,0,0.6)' }}
      >
        {label}
      </span>
      <div
        className="h-px flex-1"
        style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.08))' }}
      />
    </div>
  )
}
