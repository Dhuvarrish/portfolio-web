export interface Star {
  situation: string
  task: string
  action: string
  result: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  repoUrl?: string
  liveUrl?: string
  star?: Star
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
