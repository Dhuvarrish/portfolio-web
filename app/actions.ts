"use server"

import { apiFetch } from "@/lib/api"
import type {
  Project,
  Car,
  PagedResult,
  GitHubUser,
  GitHubRepo,
  ContributionDay,
  UserRolesResponse,
  AccessViewResponse,
} from "@/lib/types"

const gqlLevelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

// Get all the projects for Backend demo.
export async function getProjects() {
  return apiFetch<Project[]>("/api/projects")
}

// Get a single project by ID for Backend demo.
export async function getProject(id: string) {
  return apiFetch<Project>(`/api/projects/${id}`)
}

export async function getUserRoles(
  params: { search?: string; sortBy?: string; sortDir?: string; page?: number; pageSize?: number } = {}
) {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.sortBy) query.set("sortBy", params.sortBy)
  if (params.sortDir) query.set("sortDir", params.sortDir)
  query.set("page", String(params.page ?? 1))
  query.set("pageSize", String(params.pageSize ?? 8))
  return apiFetch<UserRolesResponse>(`/api/userroles?${query.toString()}`)
}

export async function getAccessView() {
  return apiFetch<AccessViewResponse>("/api/accessview")
}

export async function getCars(params: { search?: string; page?: number; pageSize?: number }) {
  const q = new URLSearchParams()
  if (params.search) q.set("search", params.search)
  q.set("page", String(params.page ?? 1))
  q.set("pageSize", String(params.pageSize ?? 10))
  return apiFetch<PagedResult<Car>>(`/api/cars?${q.toString()}`)
}

export async function getGitHubData() {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
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
  if (reposRes.ok) {
    const reposData = await reposRes.json()
    if (Array.isArray(reposData)) repos = reposData
  }

  let contributions: ContributionDay[] = []
  let totalContributions = 0

  if (token && gqlRes.ok) {
    const gql = await gqlRes.json()
    const calendar = gql?.data?.user?.contributionsCollection?.contributionCalendar
    if (calendar) {
      totalContributions = calendar.totalContributions
      contributions = calendar.weeks.flatMap(
        (w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
          w.contributionDays.map((d) => ({
            date: d.date,
            count: d.contributionCount,
            level: gqlLevelMap[d.contributionLevel] ?? 0,
          }))
      )
    }
  }

  return { user, repos, contributions, totalContributions }
}
