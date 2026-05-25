"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getProjects } from "@/app/actions"
import type { Project } from "@/lib/types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Backend API Showcase</h1>
        <p className="mt-3 text-md text-muted-foreground leading-relaxed">
          A set of demos built to showcase full-stack skills across the frontend and backend. Each project connects a Next.js
          frontend to a C# .NET API, with data served from backend mock data — no database involved.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-muted/30 p-5 h-40 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-md text-muted-foreground">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative rounded-lg border border-border bg-muted/30 p-5 hover:bg-muted/50 hover:border-muted-foreground/30 transition-all cursor-pointer flex flex-col gap-3">
      <Link
        href={`/projects/backend-api-showcase/${project.id}`}
        className="absolute inset-0 rounded-lg"
        aria-label={`View ${project.title}`}
      />
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-md group-hover:text-foreground transition-colors">{project.title}</p>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </div>

      <p className="text-md text-muted-foreground leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded bg-background px-2 py-0.5 text-md text-muted-foreground ring-1 ring-border">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
