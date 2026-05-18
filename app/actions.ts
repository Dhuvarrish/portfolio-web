"use server"

import { apiFetch } from "@/lib/api"

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  repoUrl?: string
  liveUrl?: string
}

export interface Car {
  id: number
  make: string
  model: string
  year: number
  type: string
  seatCount: number
  color: string
  price: number
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}


export interface ContactPayload {
  name: string
  email: string
  message: string
}

export type GitHubUser = {
  name: string
  login: string
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
}

export type GitHubRepo = {
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

export type ContributionDay = {
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

export async function ping() {
  return apiFetch<{ message: string }>("/api/ping")
}

export async function getProjects() {
  return apiFetch<Project[]>("/api/projects")
}

export async function getProject(id: string) {
  return apiFetch<Project>(`/api/projects/${id}`)
}


export async function sendContact(body: ContactPayload) {
  return apiFetch<void>("/api/contact", { method: "POST", body: JSON.stringify(body) })
}

export interface UserEntry {
  id: number
  userName: string
  email: string
  role: string
  roleDescription: string
}

export interface RbacRole {
  name: string
  description: string
}

export interface UserRolesResponse {
  users: UserEntry[]
  availableRoles: RbacRole[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getUserRoles(params: { search?: string; sortBy?: string; sortDir?: string; page?: number; pageSize?: number } = {}) {
  const q = new URLSearchParams()
  if (params.search) q.set("search", params.search)
  if (params.sortBy) q.set("sortBy", params.sortBy)
  if (params.sortDir) q.set("sortDir", params.sortDir)
  q.set("page", String(params.page ?? 1))
  q.set("pageSize", String(params.pageSize ?? 8))
  return apiFetch<UserRolesResponse>(`/api/userroles?${q.toString()}`)
}

export interface Resource {
  id: number
  name: string
  category: string
  allowedRoles: string[]
}

export interface AccessViewResponse {
  users: UserEntry[]
  resources: Resource[]
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
  const token = process.env.GITHUB_TOKEN ?? require("next/config").default()?.serverRuntimeConfig?.GITHUB_TOKEN
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
      contributions = calendar.weeks.flatMap(
        (w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
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
