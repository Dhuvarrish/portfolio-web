const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  ping: () => apiFetch<{ message: string }>("/api/ping"),
  getProjects: () => apiFetch<Project[]>("/api/projects"),
  getProject: (id: number) => apiFetch<Project>(`/api/projects/${id}`),
  getSkills: () => apiFetch<Skill[]>("/api/skills"),
  sendContact: (body: ContactPayload) =>
    apiFetch<void>("/api/contact", { method: "POST", body: JSON.stringify(body) }),
  getCars: (params: { search?: string; page?: number; pageSize?: number }) => {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    q.set("page", String(params.page ?? 1));
    q.set("pageSize", String(params.pageSize ?? 10));
    return apiFetch<PagedResult<Car>>(`/api/cars?${q.toString()}`);
  },
};

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
}

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  type: string;
  seatCount: number;
  color: string;
  price: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Skill {
  name: string;
  category: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}
