import Image from "next/image"
import { ExternalLink, BookOpen, Lock } from "lucide-react"
import { ContributionGrid } from "@/components/contribution-grid"
import { getGitHubData } from "@/app/actions"

export default async function GithubPage() {
  const { user, repos, contributions, totalContributions } = await getGitHubData()

  const currentYear = new Date().getFullYear()
  const currentYearContributions = contributions.filter(d => d.date.startsWith(`${currentYear}-`))

  return (
    <>
      <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={96}
          height={96}
          className="rounded-full border border-border size-16 md:size-24"
          loading="eager"
          priority
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{user.name ?? user.login}</h1>
          {user.bio && <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>}
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            @{user.login} <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-6 mb-6 md:mb-8 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><BookOpen className="size-4" /> {repos.length} repos</span>
      </div>

      <ContributionGrid contributions={currentYearContributions} total={totalContributions} />

      <h2 className="text-xl font-semibold mb-3 md:mb-4">Recent Repositories</h2>
      <div className="w-full min-w-[22rem] max-w-[25rem] md:min-w-[35rem] md:max-w-[35rem] grid gap-3">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="w-full block rounded-lg border border-border p-3 md:p-4 hover:bg-muted transition-colors overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2 w-full">
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{repo.name}</p>
                  {repo.private && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground shrink-0">
                      <Lock className="size-3" /> Private
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2 break-words overflow-hidden">{repo.description}</p>
                )}
              </div>
            </div>
            {repo.language && (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{repo.language}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
