import { Globe, Layers, Paintbrush, PackageOpen } from "lucide-react"

const builtWith = [
  { name: "Next.js 16", description: "App router, server components, file-based routing" },
  { name: "TypeScript", description: "Type safety across the entire codebase" },
  { name: "Tailwind CSS", description: "Easy global styling with a custom dark theme" },
  { name: "shadcn/ui", description: "Accessible components used throughout the application" },
  { name: "C# .NET", description: "Backend API development for Backend project demo" },
  { name: "AWS", description: "Cloud provider for compute, storage, and serverless infrastructure" },
  { name: "Terraform", description: "Infrastructure as Code to manage cloud resources" },
  { name: "Cloudflare", description: "Domain registrar, DNS, and CDN services " },
  { name: "React Icons", description: "Icon library for tech stack and UI icons" },
]

const projects: {
  name: string
  description: string
  tags: string[]
  href?: string
}[] = [
  {
    name: "SaaS Dashboard",
    description:
      "A cloud-hosted analytics dashboard with authentication, role-based access, and real-time metrics — built on AWS with Terraform-managed infrastructure.",
    tags: ["AWS", "Terraform", "Cognito", "Lambda", "DynamoDB"],
  },
]

export default function InfoPage() {
  return (
    <div className="w-full space-y-12">
      {/* About this Portfolio */}
      <section className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">About this Portfolio</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          This is my personal portfolio. A space where I share my projects and experiences. I created it to be simple, fast, and
          built to evolve over time rather than act as a static website.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          The site is designed to grow alongside my personal projects. As I take on new projects, I will continue to expand this
          website with new projects and try to document them in the &quot;Info&quot; page.
        </p>
      </section>

      {/* Built with */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-muted-foreground" />
          <h2 className="text-base font-semibold tracking-tight">Built with</h2>
        </div>
        <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
          {builtWith.map((item) => (
            <div key={item.name} className="flex items-start gap-4 px-4 py-3 bg-background hover:bg-muted/20 transition-colors">
              <span className="text-sm font-medium w-32 shrink-0">{item.name}</span>
              <span className="text-sm text-muted-foreground">{item.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Design */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Paintbrush className="size-4 text-muted-foreground" />
          <h2 className="text-base font-semibold tracking-tight">Design</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          <p>
            Dark theme with a professional blue palette, deep backgrounds to keep it clean. Colours are defined as global CSS
            variables so every component pulls from the same set of tokens rather than scattering hardcoded values through the
            codebase.
          </p>
          <p>
            UI is separated into reusable components inside the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">/components</code> folder. Components
            such as header, sidebar, footer, and page-specific bits each have have their own file.
          </p>
          <p>
            This app is built with a focus on performance and maintainability, and ensure that its mobile-friendly (Although some
            components need to be scrollable horizontally due to width constraints).
          </p>
          <p>
            Navigation uses a collapsible sidebar on desktop (a component from shadcn/ui) and a sheet drawer on mobile, so the
            content stays front and centre on any screen size.
          </p>
        </div>
      </section>
    </div>
  )
}
