"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Database, Search, GitBranch, Rocket, Shield, Check, Lock } from "lucide-react"
import { getAccessView } from "@/app/actions"
import type { UserEntry, Resource } from "@/lib/types"
import { cn } from "@/lib/utils"

const roleBadgeColors: Record<string, string> = {
  Admin: "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400",
  Manager: "bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400",
  Developer: "bg-green-500/10 text-green-600 ring-green-500/20 dark:text-green-400",
  Viewer: "bg-gray-500/10 text-gray-600 ring-gray-500/20 dark:text-gray-400",
  Auditor: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20 dark:text-yellow-400",
}

const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  GitHub: { icon: GitBranch, color: "text-purple-500", bg: "bg-purple-500/10" },
  Database: { icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
  Deployments: { icon: Rocket, color: "text-orange-500", bg: "bg-orange-500/10" },
  Administration: { icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
}

function getInitials(name: string) {
  const parts = name.trim().split(" ")
  return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase()
}

function UserDropdown({
  users,
  selectedId,
  onSelect,
}: {
  users: UserEntry[]
  selectedId: number | null
  onSelect: (id: number | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 0)
    else setQuery("")
  }, [open])

  const filtered = users.filter((u) => u.userName.toLowerCase().includes(query.toLowerCase()))

  const selected = users.find((u) => u.id === selectedId)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? `${selected.userName} (${selected.role})` : "— choose a user —"}
        </span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-background shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-muted-foreground">No users match &ldquo;{query}&rdquo;.</p>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    onSelect(u.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-muted flex items-center justify-between gap-3",
                    selectedId === u.id && "bg-muted"
                  )}
                >
                  <span>{u.userName}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                      roleBadgeColors[u.role] ?? "bg-muted text-muted-foreground ring-border"
                    )}
                  >
                    {u.role}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ResourceCard({ resource, role }: { resource: Resource; role: string }) {
  const granted = resource.allowedRoles.includes(role)
  const meta = categoryMeta[resource.category]
  const Icon = meta?.icon ?? Shield

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex flex-col gap-3 transition-colors",
        granted ? "border-border bg-background" : "border-border bg-muted/20 opacity-60"
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center justify-center size-8 rounded-lg", meta?.bg ?? "bg-muted")}>
          <Icon className={cn("size-4", meta?.color ?? "text-muted-foreground")} />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{resource.category}</span>
      </div>

      <p className="text-sm font-medium leading-snug">{resource.name}</p>

      <div
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium",
          granted ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}
      >
        {granted ? (
          <>
            <Check className="size-3.5" /> Access Granted
          </>
        ) : (
          <>
            <Lock className="size-3.5" /> No Access
          </>
        )}
      </div>
    </div>
  )
}

export function AccessView() {
  const [users, setUsers] = useState<UserEntry[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    getAccessView()
      .then((data) => {
        setUsers(data.users)
        setResources(data.resources)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const selectedUser = users.find((u) => u.id === selectedId) ?? null

  const categories = Array.from(new Set(resources.map((r) => r.category)))

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-72 rounded-lg bg-muted animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User selector */}
      <div className="max-w-sm space-y-1.5">
        <label className="text-sm font-medium">Select a user</label>
        <UserDropdown users={users} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/20 p-5">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            selectedUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {selectedUser ? getInitials(selectedUser.userName) : "?"}
        </div>
        <div className="space-y-1 min-w-0">
          {selectedUser ? (
            <>
              <p className="font-semibold text-base leading-tight">{selectedUser.userName}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              <span
                className={cn(
                  "inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
                  roleBadgeColors[selectedUser.role] ?? "bg-muted text-muted-foreground ring-border"
                )}
              >
                {selectedUser.role}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1 max-w-lg">{selectedUser.roleDescription}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">No user selected</p>
              <p className="text-xs text-muted-foreground/60">Choose a user above to view their access</p>
            </>
          )}
        </div>
      </div>

      {/* Resource cards grouped by category — always visible, "No Access" until a user is selected */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resources
                .filter((r) => r.category === category)
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} role={selectedUser?.role ?? ""} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
