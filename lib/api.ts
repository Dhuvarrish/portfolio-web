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
};

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
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
