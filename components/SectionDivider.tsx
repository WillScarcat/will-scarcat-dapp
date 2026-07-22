export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-8 px-4">
      <div className="h-px flex-1 bg-wc-border" />
      <div className="wc-mono wc-upper text-[10px] font-bold text-wc-green tracking-[0.2em]">
        {label}
      </div>
      <div className="h-px flex-1 bg-wc-border" />
    </div>
  )
}
