"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import ZoomPlugin from "yet-another-react-lightbox/plugins/zoom";
import { getProjects, type Project } from "@/app/actions";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">


      <div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          A set of demos built to showcase full-stack skills across the frontend and backend. Each project connects a Next.js frontend to a C# .NET API, with data served from in-memory mock data — no database involved.
        </p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          The architecture diagram below shows the full request flow, including database path. Database is not used here, but the current setup is designed to support it.
        </p>
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

      <div className="pt-6 space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Architecture</h1>
        <div
          className="rounded-2xl border border-border overflow-hidden cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src="/projects-architecture.png"
            alt="Projects architecture diagram"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: "/projects-architecture.png" }]}
          plugins={[ZoomPlugin]}
          zoom={{
            maxZoomPixelRatio: 5,
            zoomInMultiplier: 1.5,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: true,
          }}
          carousel={{ finite: true }}
          render={{ buttonPrev: () => null, buttonNext: () => null }}
        />
        <p className="text-center text-xs text-muted-foreground">Click image to zoom</p>
        <p className="text-center text-xs text-muted-foreground pt-1">
          Architecture diagram made with{" "}
          <a
            href="https://app.diagrams.net"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Draw.io
          </a>{" "}
          — a free, open-source diagramming tool.
        </p>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative rounded-lg border border-border bg-muted/30 p-5 hover:bg-muted/50 transition-colors flex flex-col gap-3 neon-card">
      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 rounded-lg"
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
            className="rounded bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
