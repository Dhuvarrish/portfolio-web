import Link from "next/link"
import Image from "next/image"
import {
  Code2,
  Cloud,
  Palette,
  FlaskConical,
  Trophy,
  ArrowRight,
  Users,
  ShieldCheck,
  GraduationCap,
  BadgeCheck,
} from "lucide-react"
import { TechStackIcons } from "@/components/tech-stack-icons"

const expertise = [
  {
    icon: Code2,
    bg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    title: "Full Stack Development",
    tags: ["React", "TypeScript", "Next.js", "Node.js", "Vue.js", "Dot Net", "C#", "REST APIs"],
    description: "Comfortable across the whole stack, from developing UIs to well-structured backend services.",
  },
  {
    icon: ShieldCheck,
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    iconColor: "text-rose-500",
    title: "Security & Compliance",
    tags: ["Azure AD B2C", "RBAC", "Login User Flow", "21 CFR Part 11", "Bcrypt"],
    description: "Auth systems, role-based access control, and regulatory compliance.",
  },
  {
    icon: FlaskConical,
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    iconColor: "text-amber-500",
    title: "Testing & Quality",
    tags: ["Jest", "Vitest", "TDD"],
    description: "Automated tests from core functionality to visual testing for reliability and maintainability.",
  },
  {
    icon: Cloud,
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    iconColor: "text-blue-500",
    title: "Cloud & DevOps",
    tags: ["AWS", "Azure", "Terraform", "CI/CD", "Database Management"],
    description: "From CI/CD pipelines to cloud infrastructure — setting up and maintaining scalable environments.",
  },
]

const approach = [
  {
    icon: Users,
    title: "Collaborative by nature",
    description:
      'I enjoy jumping into architectural discussions, asking "why" before "how", and working in Agile teams where feedback loops are short.',
  },
  {
    icon: ShieldCheck,
    title: "Security-aware",
    description: "Access control, auth flows, and compliance are things I think about alongside features, not after.",
  },
  {
    icon: Palette,
    title: "UI/UX focused",
    description: "Whether it's a quick prototype or an enterprise system, I try to create interfaces that feel nice to use.",
  },
  {
    icon: Code2,
    title: "Clean, readable code",
    description: "Clear names, simple logic, minimal comments — code that a future maintainer can pick up without a tour.",
  },
]

export default function AboutPage() {
  return (
    <div className="w-full space-y-14">
      {/* Hero */}
      <section className="flex flex-col sm:flex-row sm:items-stretch gap-8">
        <div className="relative w-48 h-80 rounded-xl overflow-hidden ring-2 ring-border shrink-0">
          <Image src="/me.jpg" alt="Dhuvarrish" fill className="object-cover" priority />
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-base text-muted-foreground mb-1">Hey, I&apos;m</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              <span className="text-white">Dhuvarrish</span>
            </h1>
            <p className="mt-2 text-lg font-medium text-muted-foreground">Full Stack Developer</p>
          </div>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-4xl">
            I build web applications ranging from simple tools to complex systems, with a focus on making them reliable and easy to
            use. I enjoy writing clean code, designing intuitive interfaces, and turning complex problems into straightforward
            solutions — whether that&apos;s in the frontend, backend, or cloud infrastructure.
          </p>

          <TechStackIcons />
        </div>
      </section>

      {/* Expertise — table layout instead of bento grid */}
      <section>
        <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
          {expertise.map((item) => (
            <div key={item.title} className="flex items-start gap-4 px-5 py-4 bg-background hover:bg-muted/20 transition-colors">
              <div className={`inline-flex rounded-md ${item.bg} p-2 shrink-0 mt-0.5`}>
                <item.icon className={`size-4 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 hidden sm:block">{item.description}</p>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1.5 justify-end max-w-[44%]">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Approach — simple divided list, no big numbers */}
      <section>
        <h2 className="text-xl font-bold tracking-tight mb-1">How I work</h2>
        <div className="divide-y divide-border">
          {approach.map((item) => (
            <div key={item.title} className="flex items-start gap-3 py-4">
              <item.icon className="size-4 shrink-0 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beyond the Code — flat icon + text rows, no colored inner boxes */}
      <section>
        <h2 className="text-xl font-bold tracking-tight mb-6">Beyond the Code</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Education &amp; Certifications</p>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <GraduationCap className="size-4 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Master of Technology (Software Engineering)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Federation University Australia · Completed 2023</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BadgeCheck className="size-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Azure Fundamentals</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Microsoft Certified · AZ-900 · January 2025</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Community</p>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Users className="size-4 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Secretary, BARS Student Club</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    2021–2023 · Organised meetings, maintained records, and kept club operations running smoothly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">City of Ballarat — Youth Awards</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Winner 2022 · Awarded for outstanding leadership and contribution to the student community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get in touch — simple border-top section */}
      <section className="border-t border-border pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div>
            <p className="text-sm font-medium">Open to new opportunities</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Available for full-time roles, contract work, or just a conversation if there&apos;s a good fit.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors shrink-0"
          >
            Get in touch <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
