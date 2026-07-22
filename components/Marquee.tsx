const ITEMS = [
  { text: '$WILL', accent: true },
  { text: 'PICK YOUR CAT', accent: false },
  { text: 'HOLD TO EARN', accent: false },
  { text: 'CASHCAT', accent: true },
  { text: 'MEOW', accent: false },
  { text: 'GMEOW', accent: false },
  { text: 'SHIBCAT', accent: false },
  { text: 'BUFFCAT', accent: false },
  { text: 'APPLCAT', accent: false },
  { text: 'SWITCH ANYTIME', accent: false },
  { text: 'NO PENALTY', accent: false },
  { text: 'ROBINHOOD CHAIN', accent: true },
]

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-3 mx-3">
          <span
            className="text-[11px] font-bold tracking-[0.18em] uppercase whitespace-nowrap"
            style={{ color: item.accent ? '#CCFF00' : '#4b5563' }}
          >
            {item.text}
          </span>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
        </span>
      ))}
    </>
  )
}

export default function Marquee() {
  return (
    <div
      className="overflow-hidden py-2.5"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#16161c',
      }}
    >
      <div className="flex whitespace-nowrap marquee-inner">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  )
}
