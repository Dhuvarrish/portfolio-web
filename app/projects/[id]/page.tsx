"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";
import { getProject, type Project } from "@/app/actions";
import { CarsTable } from "@/components/cars-table";
import { UserRbacTable } from "@/components/user-rbac-table";
import { AccessView } from "@/components/access-view";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getProject(id)
      .then(setProject)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full py-8 md:py-10 space-y-6 animate-pulse">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="space-y-3">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 w-16 rounded-full bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="w-full py-8 md:py-10 space-y-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>
        <p className="text-muted-foreground text-sm">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-10 space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>


      <div className="max-w-2xl space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {(project.repoUrl || project.liveUrl) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium hover:bg-muted/60 transition-colors"
              >
                <GitBranch className="size-4" />
                View Repository
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium hover:bg-muted/60 transition-colors"
              >
                <ExternalLink className="size-4" />
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>

      {project.id === "db40fc5d-db43-4878-9f33-2e3f2ad2c03d" && <CarsTable />}
      {project.id === "8f66c20f-cfd9-42ea-b3a5-eb0d640e5f4b" && <UserRbacTable />}
      {project.id === "1524871c-c57b-44c5-94a2-107f14df3b01" && <AccessView />}
    </div>
  );
}
