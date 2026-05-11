import Image from "next/image"
import { ExternalLink, Star, GitFork, Users, BookOpen, Lock } from "lucide-react"

type GitHubUser = {
  name: string
  login: string
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
}

type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  private: boolean
}

type ContributionDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

const gqlLevelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

async function getGitHubData() {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const [userRes, reposRes, gqlRes] = await Promise.all([
    fetch("https://api.github.com/users/Dhuvarrish", { headers, cache: "no-store" }),
    fetch("https://api.github.com/user/repos?sort=updated&per_page=10&visibility=all", { headers, next: { revalidate: 3600 } }),
    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `{
          user(login: "Dhuvarrish") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }`,
      }),
      cache: "no-store",
    }),
  ])

  const user: GitHubUser = await userRes.json()
  let repos: GitHubRepo[] = []
  if (!reposRes.ok) {
    console.error(`[GitHub] Repos request failed: ${reposRes.status} ${reposRes.statusText}`, await reposRes.text())
  } else {
    const reposData = await reposRes.json()
    if (Array.isArray(reposData)) {
      repos = reposData
    } else {
      console.error("[GitHub] Repos response is not an array:", JSON.stringify(reposData))
    }
  }

  let contributions: ContributionDay[] = []
  let totalContributions = 0

  if (!token) {
    console.error("[GitHub] GITHUB_TOKEN is not set in .env.local")
  } else if (!gqlRes.ok) {
    console.error(`[GitHub] GraphQL request failed: ${gqlRes.status} ${gqlRes.statusText}`)
    console.error("[GitHub] Response:", await gqlRes.text())
  } else {
    const gql = await gqlRes.json()
    if (gql.errors) {
      console.error("[GitHub] GraphQL errors:", JSON.stringify(gql.errors, null, 2))
    }
    const calendar = gql?.data?.user?.contributionsCollection?.contributionCalendar
    if (calendar) {
      totalContributions = calendar.totalContributions
      contributions = calendar.weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: gqlLevelMap[d.contributionLevel] ?? 0,
        }))
      )
    } else {
      console.error("[GitHub] No calendar data in response:", JSON.stringify(gql, null, 2))
    }
  }

  return { user, repos, contributions, totalContributions }
}

const levelClasses: Record<number, string> = {
  0: "bg-muted",
  1: "bg-green-300 dark:bg-green-900",
  2: "bg-green-400 dark:bg-green-700",
  3: "bg-green-600 dark:bg-green-500",
  4: "bg-green-800 dark:bg-green-400",
}

function countToLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0 || max === 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

function ContributionGrid({ contributions, total }: { contributions: ContributionDay[]; total: number }) {
  const maxCount = Math.max(...contributions.map(d => d.count), 1)
  const firstDay = new Date(contributions[0]?.date ?? new Date().toISOString()).getDay()
  const padded = [...Array.from({ length: firstDay }, () => null), ...contributions]
  const weeks: (ContributionDay | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

  return (
    <div className="w-[85vw] md:w-full rounded-lg border border-border p-4 mb-8">
      <p className="text-sm font-medium mb-3 text-muted-foreground">
        {total} contributions in the last year
      </p>
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="flex gap-[3px]" style={{ width: "max-content" }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) =>
                day ? (
                  <div
                    key={di}
                    title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                    className={`size-[13px] rounded-sm ${levelClasses[countToLevel(day.count, maxCount)]}`}
                  />
                ) : (
                  <div key={di} className="size-[13px]" />
                )
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`size-[10px] rounded-sm ${levelClasses[l]}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

export default async function GithubPage() {
  const { user, repos, contributions, totalContributions } = await getGitHubData()

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 overflow-hidden">
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
        <span className="flex items-center gap-1"><Users className="size-4" /> {user.followers} followers</span>
        <span>{user.following} following</span>
      </div>

      <ContributionGrid contributions={contributions} total={totalContributions} />

      <h2 className="text-xl font-semibold mb-3 md:mb-4">Recent Repositories</h2>
      <div className="w-full grid gap-3">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
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
              <ExternalLink className="size-4 shrink-0 text-muted-foreground mt-0.5" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {repo.language && <span>{repo.language}</span>}
              <span className="flex items-center gap-1"><Star className="size-3.5" /> {repo.stargazers_count}</span>
              <span className="flex items-center gap-1"><GitFork className="size-3.5" /> {repo.forks_count}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
