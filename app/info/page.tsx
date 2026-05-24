import { Layers, Paintbrush, FolderOpen, Bold } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
        <p className="text-md text-muted-foreground leading-relaxed max-w-5xl">
          This is my personal portfolio. A space where I share my projects and experiences. I created it to be simple, fast, and
          built to evolve over time rather than act as a static website.
        </p>
        <p className="text-md text-muted-foreground leading-relaxed max-w-3xl">
          The site is designed to grow alongside my personal projects. As I take on new projects, I will continue to expand this
          website with new projects and try to document them in the &quot;Info&quot; page.
        </p>
      </section>

      {/* Built with */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="size-6 text-muted-foreground" />
          <h1 className="text-lg font-semibold tracking-tight">Built with</h1>
        </div>
        <div className="divide-y divide-border border border-border rounded-lg overflow-hidden w-full max-w-3xl">
          {builtWith.map((item) => (
            <div key={item.name} className="flex items-start gap-8 px-4 py-3 bg-background hover:bg-muted/20 transition-colors">
              <span className="text-md font-medium w-32 shrink-0">{item.name}</span>
              <span className="text-md align-right  text-muted-foreground">{item.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Design */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Paintbrush className="size-6 text-muted-foreground" />
          <h1 className="text-lg font-semibold tracking-tight">Design</h1>
        </div>
        <div className="space-y-2 text-md text-muted-foreground leading-relaxed max-w-5xl">
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
            Navigation uses a collapsible sidebar on desktop (a component from shadcn/ui) and a sheet drawer on mobile (also a
            component from shadcn/ui), so the content stays visible on any screen size.
          </p>
        </div>
      </section>

      {/* About Projects */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="size-6 text-muted-foreground" />
          <h1 className="text-lg font-semibold tracking-tight">About Projects</h1>
        </div>

        <Tabs defaultValue="backend-api" className="w-full max-w-5xl">
          <TabsList className="mb-4">
            <TabsTrigger value="backend-api">Backend API Showcase</TabsTrigger>
            <TabsTrigger value="saas-dashboard">SaaS Dashboard</TabsTrigger>
          </TabsList>
          {/* Backend API Showcase */}
          <TabsContent value="backend-api" className="space-y-4 text-md text-muted-foreground leading-relaxed">
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["C# .NET", "Next.js", "TypeScript", "Tailwind CSS", "REST API"].map((tag) => (
                <span key={tag} className="rounded bg-background px-2 py-0.5 text-xs text-white ring-1 ring-border">
                  {tag}
                </span>
              ))}
            </div>
            <p>
              This project came from wanting to practice full-stack development using tools I hadn’t worked with much before. Most
              of my professional experience has been with JavaScript and TypeScript on both the frontend and backend, so I decided
              to rebuild some familiar project ideas using a C# .NET backend — a language I wanted to get more comfortable with.
            </p>
            <p>
              The backend is a C# .NET Web API built around controllers. Each controller handles a specific resource and follows
              standard REST such as GET to fetch data, POST to create, and so on. Routing in .NET works differently from Node.js
              frameworks as it uses attributes directly on the controller methods (like
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">[HttpGet]</code> and
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">[Route]</code>) rather than a
              centralised router file. The backend uses dependency to keep services separate from the controllers, which makes the
              code easier to extend later. Data is currently served as mock data with no database but the service layer is
              structured in a way that a real database could be implemented to only require changes in one place.
            </p>
            <p>
              The frontend is a Next.js app that calls the API using the native{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">fetch</code> API. Project cards are
              rendered from a list returned by the API, and each card links to a dynamic detail page using Next.js file-based
              routing (<code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">/projects/[id]</code>). The
              data for each detail page is fetched at request time so the frontend always reflects what the backend sends — nothing
              is hardcoded in the UI.
            </p>
            <p>
              The architecture diagram on the project page shows the full request flow from the browser through the API and back,
              including where a database would fit if one were added. I drew it with{" "}
              <a
                href="https://app.diagrams.net"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Draw.io
              </a>
              . The main thing I took away from this project was how .NET handles things like serialisation, middleware, and
              dependency injection compared to what I was used to in Node.js — they solve the same problems but with very different
              patterns.
            </p>
          </TabsContent>

          {/* SaaS Dashboard */}
          <TabsContent value="saas-dashboard" className="space-y-4 text-md text-muted-foreground leading-relaxed">
            <div className="flex flex-wrap gap-1.5 p-1">
              {["AWS", "Terraform", "Cognito", "Lambda", "API Gateway", "DynamoDB", "S3", "CloudFront"].map((tag) => (
                <span key={tag} className="rounded text-white px-2 py-0.5 text-xs ring-1 ring-border">
                  {tag}
                </span>
              ))}
            </div>
            <p>
              The goal of this project was to build something real on AWS. Every resource such as the database, the API, the auth,
              and hosting is defined in Terraform planned using{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">terraform plan</code> and created
              with a single <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">terraform apply</code>.
              This approach means the infrastructure is version-controlled, repeatable, and easy to remove resources and rebuild.
            </p>
            <p>
              <span className="text-foreground font-medium">Authentication</span> is handled by AWS Cognito. When a user logs in,
              Cognito returns a signed JWT (JSON Web Token). Every API request after that must include this token in the{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">Authorization</code> header. API
              Gateway checks the token automatically before the request even reaches a Lambda function and if the token is missing,
              expired, or invalid, the request is rejected with a 401. There are two demo roles:{" "}
              <span className="text-foreground font-medium">Admin</span> (can read and write metrics) and{" "}
              <span className="text-foreground font-medium">Viewer</span> (read-only, and the Revenue metric is hidden from them
              entirely). The role is embedded inside the JWT as a Cognito group, so the backend can read it without making an extra
              database call.
            </p>
            <p>
              <span className="text-foreground font-medium">The API</span> is made up of four Lambda functions sitting behind API
              Gateway: <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">login</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">logout</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">get-metrics</code>, and{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">post-metrics</code>. Each function is
              a small Node.js file that does one job. They are packaged as zip files by Terraform and deployed automatically
              whenever the source code changes.
            </p>
            <p>
              <span className="text-foreground font-medium">Metrics</span> are stored in DynamoDB which is a NoSQL database that AWS
              manages fully, meaning there are no servers to maintain. Each metric entry uses a composite key, partition key and a
              date string (<code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">DD-MM-YYYY</code>) as
              the sort key. This lets the frontend fetch all entries for a given metric and render the last 7 days on the trend
              chart.
            </p>
            <p>
              <span className="text-foreground font-medium">Security on a public demo</span> is something I had to think about
              carefully since the login credentials are shown on the page for anyone to use. To stop visitors from abusing the write
              access, the <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">post-metrics</code>{" "}
              Lambda enforces a rate limit of 10 writes per user per hour, tracked in DynamoDB with an automatic TTL so the counter
              cleans itself up. Each metric also has its own allowed range (for example, DAU (Daily Active Users) must stay between
              0 and 10,000) validated on both the frontend and backend. The frontend mirrors the backend rules so the user sees
              feedback instantly without waiting for a round trip.
            </p>
            <p>
              <span className="text-foreground font-medium">Daily reset</span> because this is a demo, the metric data resets every
              night at midnight UTC. An EventBridge rule triggers a Lambda that writes fresh values for each metric using a
              randomised delta picked from a hardcoded pool, so the 7-day trend chart always looks like real activity rather than a
              flat line.
            </p>
            <p>
              <span className="text-foreground font-medium">Hosting</span> {""}the Next.js frontend is built as a static export,
              uploaded to an S3 bucket, and served through CloudFront (AWS&apos;s CDN). The custom domain is registered and managed
              through Cloudflare, which handles the DNS and points traffic to the CloudFront distribution. This means pages load
              from an edge server close to the visitor rather than from a single region.
            </p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
