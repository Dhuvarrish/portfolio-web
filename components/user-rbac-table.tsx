"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Pencil, Search, ShieldAlert } from "lucide-react"
import { getUserRoles } from "@/app/actions"
import type { UserEntry, RbacRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const roleBadgeColors: Record<string, string> = {
  Admin: "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400",
  Manager: "bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400",
  Developer: "bg-green-500/10 text-green-600 ring-green-500/20 dark:text-green-400",
  Viewer: "bg-gray-500/10 text-gray-600 ring-gray-500/20 dark:text-gray-400",
  Auditor: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20 dark:text-yellow-400",
}

type SortKey = "userName" | "email" | "role"
type SortDir = "asc" | "desc"

const PAGE_SIZE = 10

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1)
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  const items: (number | "...")[] = [1]
  if (left > 2) items.push("...")
  for (let i = left; i <= right; i++) items.push(i)
  if (right < total - 1) items.push("...")
  items.push(total)
  return items
}

function RoleBadge({ role }: { role: string }) {
  const cls = roleBadgeColors[role] ?? "bg-muted text-muted-foreground ring-border"
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium ring-1", cls)}>{role}</span>
}

export function UserRbacTable() {
  const [users, setUsers] = useState<UserEntry[]>([])
  const [availableRoles, setAvailableRoles] = useState<RbacRole[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("userName")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const [editingUser, setEditingUser] = useState<UserEntry | null>(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [open, setOpen] = useState(false)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    getUserRoles({ search: debouncedSearch, sortBy: sortKey, sortDir, page, pageSize: PAGE_SIZE })
      .then((data) => {
        setUsers(data.users)
        setAvailableRoles(data.availableRoles)
        setTotalCount(data.totalCount)
        setTotalPages(data.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [debouncedSearch, sortKey, sortDir, page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, sortKey, sortDir])

  function handleEditOpen(user: UserEntry) {
    setEditingUser(user)
    setSelectedRole(user.role)
    setOpen(true)
  }

  function handleSave() {
    if (!editingUser) return

    const previousRole = editingUser.role
    const newRole = selectedRole
    const newDescription = availableRoles.find((r) => r.name === newRole)?.description ?? editingUser.roleDescription

    console.log("[RBAC] Permission change:", {
      userId: editingUser.id,
      userName: editingUser.userName,
      email: editingUser.email,
      previousRole,
      newRole,
      newDescription,
      changedAt: new Date().toISOString(),
    })

    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, role: newRole, roleDescription: newDescription } : u)))
    toast.success(`${editingUser.userName}'s role updated to ${newRole}.`)
    setOpen(false)
  }

  const selectedRoleDescription = availableRoles.find((r) => r.name === selectedRole)?.description ?? ""

  const isDirty = selectedRole !== editingUser?.role

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="size-3.5 opacity-40" />
    return sortDir === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
  }

  return (
    <div className="space-y-5">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user, email or role…"
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border border-border bg-muted/20 overflow-x-auto min-h-[650px]">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <button
                  onClick={() => handleSort("userName")}
                  className="inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors"
                >
                  User <SortIcon col="userName" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("email")}
                  className="inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors"
                >
                  Email <SortIcon col="email" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("role")}
                  className="inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors"
                >
                  Role <SortIcon col="role" />
                </button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 rounded bg-muted animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  {debouncedSearch ? `No users match "${debouncedSearch}".` : "No users found."}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.userName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal text-sm text-muted-foreground leading-snug">
                    {user.roleDescription}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleEditOpen(user)}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-muted-foreground">
            {totalCount} user{totalCount !== 1 ? "s" : ""} &mdash; page {page} of {totalPages}
          </p>
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="gap-1"
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <div className="flex gap-1">
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="h-8 w-6 flex items-center justify-center text-xs text-muted-foreground select-none"
                  >
                    &hellip;
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    disabled={loading}
                    className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
                      p === page ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="gap-1"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {editingUser?.userName}&apos;s permissions</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-1">
            {/* Security note */}
            <div className="flex gap-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3.5">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <p className="text-xs leading-relaxed text-yellow-700 dark:text-yellow-300">
                <span className="font-semibold">Note:</span> Due to security reasons, only local state is updated and permission
                changes are console logged. No requests are made to the backend on saving this form.
              </p>
            </div>

            {/* User details */}
            <div className="space-y-3">
              <div className="grid grid-cols-[5rem_1fr] items-center gap-2 text-sm">
                <span className="text-muted-foreground">User</span>
                <span className="font-medium">{editingUser?.userName}</span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] items-center gap-2 text-sm">
                <span className="text-muted-foreground">Email</span>
                <span className="text-muted-foreground">{editingUser?.email}</span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] items-center gap-2 text-sm">
                <span className="text-muted-foreground">Current role</span>
                <RoleBadge role={editingUser?.role ?? ""} />
              </div>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="role-select">
                Change role
              </label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {availableRoles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>

              {selectedRoleDescription && (
                <p className="text-xs text-muted-foreground leading-relaxed pl-0.5">{selectedRoleDescription}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-1">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={handleSave} disabled={!isDirty}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
