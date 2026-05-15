"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitBranch } from "lucide-react";
import { getProjects, type Project } from "@/app/actions";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          What I&apos;ve built
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-muted/30 p-5 h-40 animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative rounded-2xl border border-border bg-muted/30 p-5 hover:bg-muted/50 transition-colors flex flex-col gap-3">
      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 rounded-2xl"
        aria-label={`View ${project.title}`}
      />

      <div>
        <p className="font-semibold text-sm mb-1.5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          {project.title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border"
          >
            {tag}
          </span>
        ))}
      </div>

      {(project.repoUrl || project.liveUrl) && (
        /* relative + z-10 keeps these links above the overlay */
        <div className="relative z-10 flex gap-3 pt-1 border-t border-border">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitBranch className="size-3.5" />
              Repo
            </a>
          )}
        </div>
      )}
    </div>
  );
}
