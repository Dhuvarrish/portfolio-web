"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, type Project } from "@/app/actions";
import { toast } from "sonner";
import { ping } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePing() {
    setLoading(true);
    try {
      const data = await ping();
      toast.success(data.message, { duration: 3000 });
    } catch {
      toast.error("Failed to connect to backend.", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  }


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
        <Button
          onClick={handlePing}
          disabled={loading}
          size="lg"
          className="fixed Top-16 right-6 z-50 shadow-lg"
        >
          {loading ? "Connecting..." : "Test Backend Connection"}
        </Button>
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
    </div>
  );
}
