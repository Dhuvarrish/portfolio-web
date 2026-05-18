import Link from "next/link";
import Image from "next/image";
import { Code2, Cloud, Palette, FlaskConical, Trophy, ArrowRight, Users, ShieldCheck, Venus, Frame, GraduationCap, BadgeCheck } from "lucide-react";

const techStack = ["React", "TypeScript", "Next.js", "Vue.js", "Node.js", "Dot Net", "C#", "AWS", "Azure", "Dockers", "Jest", "Vitest"];

const expertise = [
  {
    icon: Code2,
    bg: "bg-green-500/10 dark:bg-green-500/15",
    iconColor: "text-green-500",
    title: "Full Stack Development",
    tags: ["React", "TypeScript", "Next.js", "Node.js", "Vue.js", "Dot Net", "C#", "REST APIs", "UI Frameworks"],
    description: "Comfortable across the whole stack, from developing UIs to well-structured backend services.",
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
    icon: FlaskConical,
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    iconColor: "text-amber-500",
    title: "Testing & Quality",
    tags: ["Jest", "Vitest", "TDD"],
    description: "Automated tests from testing core functionality and visual testing to ensure reliability and maintainability.",
    cols: "sm:col-span-2 lg:col-span-1",
  },
  {
    icon: Cloud,
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    iconColor: "text-blue-500",
    title: "Cloud & DevOps",
    tags: ["AWS", "Azure", "Terraform", "CI/CD", "Database Management"],
    description: "From CI.CD pipelines to cloud infrastructure, I can set up and maintain scalable environments.",
    cols: "",
  },
];

const approach = [
  {
    num: "01",
    icon: Users,
    title: "Collaborative by nature",
    description:
      "I enjoy jumping into architectural discussions, asking \"why\" before \"how\", and working in Agile teams where feedback and collaboration are prioritized.",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Security-aware",
    description:
      "Access control, auth flows, and compliance are things I think about alongside features.",
  },
  {
    num: "03",
    icon: Palette,
    title: "UI/UX focused",
    description:
      "Whether I am building a quick prototype or an enterprise system, I like to create interfaces that feel nice to use.",
  },
  {
    num: "04",
    icon: Code2,
    title: "Clean, readable code",
    description:
      "I try to write code that’s easy to maintain — clear names, simple logic, simple code comments and proper documentation.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full space-y-14">

      {/* Hero */}
      <section className="flex flex-col sm:flex-row sm:items-stretch gap-8">
        <div className="relative w-48 h-80 rounded-2xl overflow-hidden ring-2 ring-border ">
          <Image
            src="/me.jpg"
            alt="Dhuvarrish"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-5">
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

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-4xl">
            I build web applications ranging from simple tools to complex systems, with a focus on making them reliable and easy to use.
            I enjoy writing clean code, designing intuitive interfaces, and turning complex problems into straightforward solutions, whether that&apos;s in the frontend, backend, or cloud infrastructure.
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
        <h2 className="text-xl font-bold tracking-tight mb-4">My Approach</h2>
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

      <div>
      <h2 className="text-xl font-bold tracking-tight mb-4">Beyond the Code</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Knowledge */}

        <section className="rounded-2xl border border-border bg-muted/30 p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Degree & achievements
          </p>

          <div className="flex items-start gap-3 rounded-xl border border-violet-200/70 dark:border-violet-900/40 bg-violet-50 dark:bg-violet-950/20 p-4">
            <div className="rounded-lg bg-violet-100 dark:bg-violet-900/40 p-2 shrink-0">
              <GraduationCap className="size-4 text-violet-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold leading-snug">Master of Technology (Software Engineering)</p>
              <p className="text-xs text-muted-foreground">Federation University Australia</p>
              <span className="mt-1 w-fit rounded-full bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-400">
                Completed 2023
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-sky-200/70 dark:border-sky-900/40 bg-sky-50 dark:bg-sky-950/20 p-4 mt-auto">
            <div className="rounded-lg bg-sky-100 dark:bg-sky-900/40 p-2 shrink-0">
              <BadgeCheck className="size-4 text-sky-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold leading-snug">Azure Fundamentals</p>
              <p className="text-xs text-muted-foreground">Microsoft Certified · AZ-900</p>
              <span className="mt-1 w-fit rounded-full bg-sky-100 dark:bg-sky-900/40 px-2 py-0.5 text-xs font-medium text-sky-600 dark:text-sky-400">
                January 2025
              </span>
            </div>
          </div>
        </section>

        {/* Community involvement */}
        <section className="rounded-2xl border border-border bg-muted/30 p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Community involvement
          </p>
          <div className="flex items-start gap-3 rounded-xl border border-teal-200/70 dark:border-teal-900/40 bg-teal-50 dark:bg-teal-950/20 p-4">
            <div className="rounded-lg bg-teal-100 dark:bg-teal-900/40 p-2 shrink-0">
              <Users className="size-4 text-teal-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold leading-snug">Secretary, BARS Student Club</p>
              <p className="text-xs text-muted-foreground">2021 - 2023</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Organised meetings, maintained records, and kept club operations running smoothly over two years.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4">
            <div className="rounded-lg bg-amber-100 dark:bg-amber-900/40 p-2 shrink-0">
              <Trophy className="size-4 text-amber-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold leading-snug">City of Ballarat - Youth Awards</p>
              <p className="text-xs text-muted-foreground">Winner 2022</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Awarded for outstanding leadership and contribution to the student community.
              </p>
            </div>
          </div>
        </section>

        {/* Get in touch */}
        <section className="rounded-2xl bg-green-600 p-6 flex flex-col justify-between gap-6">
          <div>
            <h1 className="font-semibold uppercase text-green-200 mb-3 align-middle tracking-wide">
              Get in touch
            </h1>
            <p className="text-sm text-green-100 leading-relaxed">
              I’m open to new opportunities and happy to have a conversation if there’s a good fit.
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
    </div>
  );
}