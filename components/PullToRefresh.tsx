'use client'

import { useEffect, useRef } from 'react'

export default function PullToRefresh() {
  const startY = useRef(0)
  const pulling = useRef(false)

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
        pulling.current = true
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!pulling.current) return
      const delta = e.touches[0].clientY - startY.current
      if (delta > 80) {
        pulling.current = false
        window.location.reload()
      }
    }

    function onTouchEnd() {
      pulling.current = false
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return null
}
