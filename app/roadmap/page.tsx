import { CheckCircle2, Clock, Rocket, Sparkles } from 'lucide-react'

type Phase = {
  status: 'LIVE' | 'SOON' | 'COMING' | 'FUTURE'
  phase: string
  title: string
  items: { label: string; done?: boolean }[]
}

const PHASES: Phase[] = [
  {
    status: 'LIVE',
    phase: 'Phase 1',
    title: 'Foundation',
    items: [
      { label: 'Smart contracts deployed', done: true },
      { label: 'Pick Your Cat live', done: true },
      { label: 'dApp live on Robinhood Chain', done: true },
      { label: 'Cat factions live', done: true },
    ],
  },
  {
    status: 'SOON',
    phase: 'Phase 2',
    title: 'Growth',
    items: [
      { label: 'DexScreener listing' },
      { label: '1,000+ unique holders' },
      { label: 'Additional cats added' },
      { label: 'First governance vote' },
    ],
  },
  {
    status: 'COMING',
    phase: 'Phase 3',
    title: 'Mobile',
    items: [
      { label: 'PWA mobile app (iOS + Android)' },
      { label: 'Push notifications for rewards' },
      { label: 'Portfolio tracker dashboard' },
      { label: 'Cat leaderboard' },
    ],
  },
  {
    status: 'FUTURE',
    phase: 'Phase 4',
    title: 'DAO',
    items: [
      { label: '$WILL holder voting rights' },
      { label: 'New cats via governance' },
      { label: 'Cross-chain reward bridging' },
      { label: 'On-chain treasury management' },
    ],
  },
]

const STATUS_CONFIG = {
  LIVE: {
    label: 'Live',
    color: '#CCFF00',
    bg: 'rgba(204,255,0,0.08)',
    border: 'rgba(204,255,0,0.25)',
    icon: CheckCircle2,
  },
  SOON: {
    label: 'Soon',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.25)',
    icon: Clock,
  },
  COMING: {
    label: 'Coming',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
    icon: Rocket,
  },
  FUTURE: {
    label: 'Future',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.25)',
    icon: Sparkles,
  },
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(204,255,0,0.6)' }}>
            Will Scarcat
          </div>
          <h1 className="font-black text-4xl md:text-5xl text-white mb-3 leading-none tracking-tight">
            Road<span style={{ color: '#CCFF00' }}>map</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            From launch to DAO — here's where Will Scarcat is going. Phases are sequential,
            community-driven, and subject to change by governance vote.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector */}
          <div
            className="absolute left-[27px] top-10 bottom-10 w-px hidden sm:block"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />

          <div className="space-y-4">
            {PHASES.map((phase) => {
              const cfg = STATUS_CONFIG[phase.status]
              const StatusIcon = cfg.icon
              return (
                <div key={phase.phase} className="flex gap-4 sm:gap-6">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 shrink-0 flex items-center justify-center z-10"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                  >
                    <StatusIcon size={20} style={{ color: cfg.color }} />
                  </div>

                  {/* Card */}
                  <div className="glass-card flex-1 overflow-hidden">
                    {/* Header row */}
                    <div
                      className="flex items-center justify-between px-5 py-3.5 gap-4"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                          {phase.phase}
                        </span>
                        <span className="font-black text-white text-sm uppercase tracking-wide">
                          {phase.title}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-black uppercase tracking-widest shrink-0 px-2 py-1"
                        style={{
                          color: cfg.color,
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {/* Items */}
                    <ul className="px-5 py-4 space-y-2.5">
                      {phase.items.map((item) => (
                        <li key={item.label} className="flex items-start gap-2.5">
                          <span
                            className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              background: item.done ? '#CCFF00' : 'rgba(255,255,255,0.15)',
                            }}
                          />
                          <span
                            className="text-xs leading-relaxed"
                            style={{
                              color: item.done ? '#ffffff' : '#6b7280',
                            }}
                          >
                            {item.label}
                          </span>
                          {item.done && (
                            <CheckCircle2
                              size={12}
                              className="shrink-0 mt-0.5"
                              style={{ color: '#CCFF00' }}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer note */}
        <div
          className="mt-8 px-5 py-4 glass-card"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest leading-relaxed">
            Roadmap items may shift based on community governance · All timelines are estimates
          </p>
        </div>
      </div>
    </div>
  )
}
