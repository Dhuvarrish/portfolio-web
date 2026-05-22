"use client"

import { useRef, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SiReact, SiTypescript, SiNextdotjs, SiVuedotjs, SiNodedotjs, SiDotnet, SiDocker, SiJest, SiVitest } from "react-icons/si"
import { FaAws } from "react-icons/fa"
import { TbBrandCSharp, TbBrandAzure } from "react-icons/tb"
import type { IconType } from "react-icons"

const stack = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Next.js", Icon: SiNextdotjs, color: "currentColor" },
  { name: "Vue.js", Icon: SiVuedotjs, color: "#4FC08D" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "Dot Net", Icon: SiDotnet, color: "#512BD4" },
  { name: "C#", Icon: TbBrandCSharp, color: "#68217A" },
  { name: "AWS", Icon: FaAws, color: "#FF9900" },
  { name: "Azure", Icon: TbBrandAzure, color: "#0078D4" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Jest", Icon: SiJest, color: "#C21325" },
  { name: "Vitest", Icon: SiVitest, color: "#6E9F18" },
]

function StackIcon({ name, Icon, color }: { name: string; Icon: IconType; color: string }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = () => {
    if (!isMobile) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(true)
    timerRef.current = setTimeout(() => setOpen(false), 1500)
  }

  return (
    <Tooltip open={isMobile ? open : undefined} onOpenChange={isMobile ? undefined : setOpen}>
      <TooltipTrigger asChild>
        <span
          onClick={handleClick}
          className="inline-flex items-center justify-center rounded-md bg-muted p-2 ring-1 ring-border hover:bg-muted/70 transition-colors cursor-default"
        >
          <Icon size={20} style={{ color }} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs font-medium">{name}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function TechStackIcons() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-wrap gap-3">
        {stack.map(({ name, Icon, color }) => (
          <StackIcon key={name} name={name} Icon={Icon} color={color} />
        ))}
      </div>
    </TooltipProvider>
  )
}
