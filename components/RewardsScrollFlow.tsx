'use client'

import { useEffect, useRef } from 'react'
import { Repeat, Zap, Cat, Coins } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    icon: Repeat,
    title: 'Swap happens on Robinhood Chain',
    body: 'Every $WILL buy or sell on any DEX on Robinhood Chain triggers a tax on the transaction.',
  },
  {
    icon: Zap,
    title: 'Tax is captured by the Tracker',
    body: 'The Tracker contract collects the tax and logs the weight of each $WILL holder per faction.',
  },
  {
    icon: Cat,
    title: 'Weight routes to your cat',
    body: "Your $WILL balance determines your weight. If you picked a cat, your weight goes to that faction's reward pool.",
  },
  {
    icon: Coins,
    title: 'Claim any time — no lock-up',
    body: 'Open the Terminal, hit Claim, and your earned dividends land in your wallet instantly. Switch cats any time with no penalty.',
    accent: true,
  },
]

export function RewardsScrollFlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = containerRef.current?.querySelectorAll<HTMLElement>('.flow-step')
      if (!steps) return

      steps.forEach((step, i) => {
        const iconBox = step.querySelector<HTMLElement>('.step-icon-box')
        const iconEl = step.querySelector<SVGElement>('.step-icon-svg')
        const title = step.querySelector<HTMLElement>('.step-title')
        const connector = step.querySelector<HTMLElement>('.step-connector')

        ScrollTrigger.create({
          trigger: step,
          start: 'top 78%',
          onEnter: () => {
            if (iconBox) {
              gsap.to(iconBox, {
                borderColor: '#CCFF00',
                backgroundColor: 'rgba(204,255,0,0.08)',
                duration: 0.35,
                ease: 'power2.out',
              })
            }
            if (iconEl) {
              gsap.to(iconEl, { color: '#CCFF00', duration: 0.35 })
            }
            if (title) {
              gsap.to(title, {
                color: STEPS[i].accent ? '#CCFF00' : '#ffffff',
                duration: 0.3,
                ease: 'power2.out',
              })
            }
            if (connector) {
              gsap.to(connector, {
                backgroundColor: 'rgba(204,255,0,0.2)',
                duration: 0.6,
                delay: 0.25,
              })
            }
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-3 mb-10">
      {STEPS.map((step, i) => (
        <div key={i} className="flow-step glass-card flex gap-5 p-5">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div
              className="step-icon-box w-9 h-9 flex items-center justify-center"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'border-color 0.35s, background-color 0.35s',
              }}
            >
              <step.icon
                size={16}
                className="step-icon-svg"
                style={{ color: '#4b5563', transition: 'color 0.35s' }}
              />
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="step-connector w-px flex-1"
                style={{ background: 'rgba(255,255,255,0.06)', minHeight: 20 }}
              />
            )}
          </div>
          <div className="pt-1.5 min-w-0">
            <div
              className="step-title font-bold text-sm mb-1.5"
              style={{ color: '#9ca3af', transition: 'color 0.3s' }}
            >
              {`0${i + 1}. `}{step.title}
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">{step.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
