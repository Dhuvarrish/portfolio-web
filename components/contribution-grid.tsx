"use client"

import { useRef, useEffect } from "react"

type ContributionDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

const levelClasses: Record<number, string> = {
  0: "bg-muted",
  1: "bg-green-300 dark:bg-green-900",
  2: "bg-green-400 dark:bg-green-700",
  3: "bg-green-600 dark:bg-green-500",
  4: "bg-green-800 dark:bg-green-400",
}

function countToLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0 || max === 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]
const DAY_LABEL_W = 28

export function ContributionGrid({ contributions, total }: { contributions: ContributionDay[]; total: number }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const maxCount = Math.max(...contributions.map(d => d.count), 1)
  const firstDay = contributions.length > 0 ? new Date(contributions[0].date).getDay() : 0
  const padded = [...Array.from({ length: firstDay }, () => null), ...contributions]
  const weeks: (ContributionDay | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

  const monthLabels: { label: string; weekIndex: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstReal = week.find(d => d !== null)
    if (firstReal) {
      const month = new Date(firstReal.date).getMonth()
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTH_NAMES[month], weekIndex: wi })
        lastMonth = month
      }
    }
  })

  return (
    <div className="w-full min-w-[22rem] max-w-[25rem] md:min-w-[35rem] md:max-w-[35rem] rounded-lg border border-border p-10 mb-8">
      <p className="text-sm font-medium mb-3 text-muted-foreground">
        {total} contributions in the last year
      </p>

      <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden">
        <div style={{ width: "max-content", paddingBottom: 20 }}>
          {/* Month labels */}
          <div className="flex gap-[3px]" style={{ paddingLeft: DAY_LABEL_W, height: 18 }}>
            {weeks.map((week, wi) => {
              const label = monthLabels.find(m => m.weekIndex === wi)
              return (
                <div key={wi} style={{ width: 13, flexShrink: 0, position: "relative" }}>
                  {label && (
                    <span className="absolute text-[10px] text-muted-foreground whitespace-nowrap left-0 top-0">
                      {label.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Day labels + grid */}
          <div className="flex gap-[3px]">
            <div className="flex flex-col gap-[3px]" style={{ width: DAY_LABEL_W }}>
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="flex items-center justify-end pr-1" style={{ height: 13 }}>
                  <span className="text-[10px] text-muted-foreground leading-none">{label}</span>
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) =>
                  day ? (
                    <div
                      key={di}
                      title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                      className={`size-[13px] rounded-sm ${levelClasses[countToLevel(day.count, maxCount)]}`}
                    />
                  ) : (
                    <div key={di} className="size-[13px]" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`size-[10px] rounded-sm ${levelClasses[l]}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
