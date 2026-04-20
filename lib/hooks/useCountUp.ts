import { useState, useEffect } from 'react'

// lib/hooks/useCountUp.ts
// Animates a number from 0 to `target` with an ease-out cubic curve.
// Works with integers and one-decimal floats (e.g. "4.7").

export function useCountUp(
  target: number | string,
  duration = 1400,
  delay = 0
): number | string {
  const [value, setValue] = useState<number | string>(0)

  useEffect(() => {
    const numTarget = parseFloat(String(target)) || 0
    const isFloat = String(target).includes('.')
    let raf: number
    let startTime: number | null = null

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = numTarget * eased
        setValue(isFloat ? current.toFixed(1) : Math.round(current))
        if (progress < 1) {
          raf = requestAnimationFrame(step)
        } else {
          setValue(target)
        }
      }
      raf = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])

  return value
}
