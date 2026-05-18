import Link from "next/link";
import { Code2, Cloud, Palette, FlaskConical, Trophy, ArrowRight, Users, ShieldCheck, Venus, Frame } from "lucide-react";

const techStack = ["React", "TypeScript", "Next.js", "Vue.js", "Node.js", "Dot Net", "C#", "AWS", "Azure", "Dockers", "Jest", "Vitest"];

const expertise = [
  {
    icon: Code2,
    bg: "bg-green-500/10 dark:bg-green-500/15",
    iconColor: "text-green-500",
    title: "Full Stack Development",
    tags: ["React", "TypeScript", "Next.js", "Node.js", "Vue.js", "Dot Net", "C#", "REST APIs", "UI Frameworks"],
    description: "Comfortable across the whole stack — from pixel-perfect UIs to well-structured backend services.",
    cols: "sm:col-span-2 lg:col-span-1",
  },
  {
    icon: ShieldCheck,
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    iconColor: "text-rose-500",
    title: "Security & Compliance",
    tags: ["Azure AD B2C", "RBAC", "Login User Flow", "21 CFR Part 11", "Bcrypt"],
    description: "Auth systems, role-based access control (RBAC), and regulatory compliance.",
    cols: "",
  },
  {
    icon: Cloud,
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    iconColor: "text-blue-500",
    title: "Cloud & DevOps",
    tags: ["AWS", "Azure", "Terraform", "CI/CD", "Database Management"],
    description: "Designed for scale and security from day one, not bolted on after.",
    cols: "",
  },

  {
    icon: FlaskConical,
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    iconColor: "text-amber-500",
    title: "Testing & Quality",
    tags: ["Jest", "Vitest", "TDD"],
    description: "Shipping confidently matters. Tests are part of the feature, not optional extras.",
    cols: "sm:col-span-2 lg:col-span-1",
  },
];

const approach = [
  {
    num: "01",
    icon: Users,
    title: "Collaborative by nature",
    description:
      "I enjoy jumping into architectural discussions, asking \"why\" before \"how\", and working in Agile teams where feedback loops are short.",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Security-aware",
    description:
      "Access control, auth flows, and compliance are things I think about alongside features — not as an afterthought.",
  },
  {
    num: "03",
    icon: Palette,
    title: "UX-first mindset",
    description:
      "Whether it's a prototype or a production system, I build interfaces that feel intuitive and write code that's easy to reason about.",
  },
  {
    num: "04",
    icon: Code2,
    title: "Clean, readable code",
    description:
      "I write code for the next person who reads it — clear naming, minimal complexity, and no clever tricks that trade maintainability for brevity.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full space-y-14">

      {/* Hero */}
      <section className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">Open to opportunities</span>
        </div>

        <div>
          <p className="text-base text-muted-foreground mb-1">Hey, I&apos;m</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            <span className="text-green-700 dark:text-green-400">
              Dhuvarrish
            </span>
          </h1>
          <p className="mt-2 text-lg font-medium text-muted-foreground">Full Stack Developer</p>
        </div>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
          I build web applications that feel great to use. I get excited about clean code,
          thoughtful design, and making complex problems feel simple — whether that&apos;s a
          polished UI, a well-structured API, or a scalable cloud setup.
        </p>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Expertise — bento grid */}
      <section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {expertise.map((item) => (
            <div
              key={item.title}
              className={`${item.cols} rounded-2xl border border-border bg-muted/30 p-5 hover:bg-muted/50 transition-colors flex flex-col gap-3`}
            >
              <div className={`inline-flex rounded-xl ${item.bg} p-2.5 w-fit`}>
                <item.icon className={`size-5 ${item.iconColor}`} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Approach — 3-col cards */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          My approach
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {approach.map((item) => (
            <div
              key={item.num}
              className="rounded-2xl border border-border bg-muted/30 p-5 hover:bg-muted/50 transition-colors flex flex-col gap-3"
            >
              <span className="text-5xl font-black text-green-700/15 dark:text-green-400/15 leading-none select-none">
                {item.num}
              </span>
              <div>
                <p className="font-semibold text-sm mb-1.5">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personal + CTA — 2-col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Personal */}
        <section className="rounded-2xl border border-border bg-muted/30 p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            A bit about me
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Outside of work I&apos;ve been pretty involved in my community. I spent two years as
            Secretary of a student association — organising meetings, maintaining records, and
            keeping things running smoothly.
          </p>
          <div className="flex items-start gap-3 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4 mt-auto">
            <div className="rounded-lg bg-amber-100 dark:bg-amber-900/40 p-2 shrink-0">
              <Trophy className="size-4 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-xs">City of Ballarat Youth Awards — Winner 2022</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Awarded for outstanding leadership and contribution to the student community
                through mentoring and guiding peers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-green-600 p-6 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-200 mb-3">
              Get in touch
            </p>
            <p className="font-bold text-xl text-white leading-snug">
              Let&apos;s build something together
            </p>
            <p className="text-sm text-green-100 mt-2 leading-relaxed">
              Got a project in mind, want to collaborate, or just want to say hi?
              I&apos;d love to hear from you.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-green-700 px-5 py-2.5 text-sm font-semibold hover:bg-green-50 transition-colors w-fit shadow-sm"
          >
            Send a message
            <ArrowRight className="size-4" />
          </Link>
        </section>

      </div>
    </div>
  );
}
