"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Check, LogOut, Plus, X, TrendingUp, TrendingDown, Timer } from "lucide-react"
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts"

const API_URL = process.env.NEXT_PUBLIC_DEMO_API_URL ?? ""

interface AuthState {
  token: string
  username: string
  role: "Admin" | "Viewer"
}

interface MetricPoint {
  date: string
  value: number
}
interface Metric {
  id: string
  label: string
  value: number
  prefix?: string
  suffix?: string
  trend: number
  color: string
  history: MetricPoint[]
}

interface DynamoItem {
  pk: string
  sk: string
  metricName: string
  value: number
  date: string
}

const VALID_METRIC_IDS = new Set(["dau", "revenue", "signups", "churn"])
const MAX_METRIC_VALUE = 1_000_000_000
const USERNAME_RE = /^[a-z0-9]{1,30}$/

function validateUsername(raw: string): string {
  const v = raw.trim().toLowerCase()
  if (!USERNAME_RE.test(v)) throw new Error("Username must be 1–30 alphanumeric characters.")
  return v
}

function validatePassword(raw: string): string {
  if (raw.length < 1 || raw.length > 128) throw new Error("Invalid credentials.")
  return raw
}

function validateMetricId(id: string): string {
  if (!VALID_METRIC_IDS.has(id)) throw new Error("Invalid metric selection.")
  return id
}

function validateMetricDelta(raw: string): number {
  const v = Number(raw)
  if (!Number.isFinite(v) || Math.abs(v) > MAX_METRIC_VALUE)
    throw new Error(`Value must be between −${MAX_METRIC_VALUE.toLocaleString()} and +${MAX_METRIC_VALUE.toLocaleString()}.`)
  return v
}

const METRIC_META: Record<string, { label: string; color: string; prefix?: string; suffix?: string }> = {
  dau: { label: "Daily Active Users", color: "#3b82f6" },
  revenue: { label: "Revenue", color: "#cc8787", prefix: "$" },
  signups: { label: "Signups", color: "#f59e0b" },
  churn: { label: "Churn Rate", color: "#ef4444", suffix: "%" },
}

function buildMetrics(items: DynamoItem[]): Metric[] {
  const grouped: Record<string, DynamoItem[]> = {}
  for (const item of items) {
    if (VALID_METRIC_IDS.has(item.metricName)) {
      if (!grouped[item.metricName]) grouped[item.metricName] = []
      grouped[item.metricName].push(item)
    }
  }

  return Object.entries(grouped).map(([id, dbItems]) => {
    const meta = METRIC_META[id]
    const sorted = [...dbItems].sort((a, b) => a.date.localeCompare(b.date))
    const last7 = sorted.slice(-7)
    const latest = last7[last7.length - 1]
    const prev = last7.length > 1 ? last7[last7.length - 2].value : latest.value
    const trend = prev !== 0 ? +(((latest.value - prev) / prev) * 100).toFixed(1) : 0
    const history = last7.map((item) => ({
      date: new Date(item.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: item.value,
    }))
    return { id, ...meta, value: latest.value, trend, history }
  })
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(b64))
  } catch {
    return {}
  }
}

async function cognitoLogin(rawUsername: string, rawPassword: string): Promise<AuthState> {
  const username = validateUsername(rawUsername)
  validatePassword(rawPassword)

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: rawPassword }),
  })
  const data = (await res.json()) as { idToken?: string; error?: string }
  if (!res.ok) throw new Error(data.error ?? "Login failed.")

  const token = data.idToken!
  const payload = decodeJwtPayload(token)
  const groups = (payload["cognito:groups"] as string[] | undefined) ?? []
  return { token, username, role: groups.includes("admin") ? "Admin" : "Viewer" }
}

async function cognitoLogout(token: string, username: string): Promise<void> {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ username }),
  }).catch(() => null)
}

const SESSION_SECONDS = 2 * 60

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <button
        onClick={copy}
        className="group flex items-center justify-between gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-sm transition-colors hover:bg-muted"
      >
        <span className="text-foreground">{value}</span>
        {copied ? (
          <Check className="size-3.5 shrink-0 text-green-500" />
        ) : (
          <Copy className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </button>
    </div>
  )
}

const DEMO_ACCOUNTS = [
  { role: "Admin", username: "admin", password: "Admin123!", badge: "bg-red-900/40 text-red-300 ring-1 ring-red-800" },
  { role: "Viewer", username: "viewer", password: "Viewer123!", badge: "bg-muted text-muted-foreground ring-1 ring-border" },
]

function CredentialsCard() {
  return (
    <div className="w-full max-w-4xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demo Credentials — click to copy</p>
      <div className="grid grid-cols-2 gap-3">
        {DEMO_ACCOUNTS.map(({ role, username, password, badge }) => (
          <div
            key={role}
            className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-5 transition-colors hover:bg-muted/40"
          >
            <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}>{role}</span>
            <CopyField label="Username" value={username} />
            <CopyField label="Password" value={password} />
          </div>
        ))}
      </div>
    </div>
  )
}

function LoginScreen({ onLogin }: { onLogin: (a: AuthState) => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      onLogin(await cognitoLogin(username, password))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <form onSubmit={submit} className="flex w-full max-w-xs flex-col gap-4">
        <div className="mb-1 text-center">
          <h2 className="text-base font-semibold text-foreground">Sign in</h2>
          <p className="mt-1 text-xs text-muted-foreground">Use the demo credentials above</p>
        </div>

        {(["Username", "Password"] as const).map((field) => (
          <div key={field} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">{field}</label>
            <input
              type={field === "Password" ? "password" : "text"}
              value={field === "Password" ? password : username}
              onChange={(e) => (field === "Password" ? setPassword(e.target.value) : setUsername(e.target.value))}
              required
              autoComplete={field === "Password" ? "current-password" : "username"}
              placeholder={field === "Password" ? "••••••••" : "admin or viewer"}
              maxLength={field === "Password" ? 128 : 30}
              pattern={field === "Password" ? undefined : "[a-zA-Z0-9]+"}
              className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}

        {error && <p className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-xs text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}

function MetricCard({ m, flash }: { m: Metric; flash?: number }) {
  const trendUp = m.trend >= 0
  const formatted = m.prefix
    ? `${m.prefix}${m.value.toLocaleString()}`
    : m.suffix
      ? `${m.value}${m.suffix}`
      : m.value.toLocaleString()

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-5 transition-colors hover:bg-muted/40">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.label}</span>
        <span
          className={`flex shrink-0 items-center gap-0.5 text-xs font-semibold ${trendUp ? "text-emerald-400" : "text-red-400"}`}
        >
          {trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          {Math.abs(m.trend)}%
        </span>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold tracking-tight text-foreground">{formatted}</p>
        {flash !== undefined && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${flash >= 0 ? "bg-emerald-900/60 text-emerald-400" : "bg-red-900/60 text-red-400"}`}
          >
            {flash >= 0 ? "+" : ""}
            {flash.toLocaleString()}
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={56}>
        <LineChart data={m.history} margin={{ top: 2, right: 2, left: -40, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--muted))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 6,
              fontSize: 11,
              color: "hsl(var(--foreground))",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            cursor={{ stroke: "hsl(var(--border))" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={m.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: m.color, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const METRIC_OPTIONS = [
  { value: "dau", label: "Daily Active Users" },
  { value: "revenue", label: "Revenue" },
  { value: "signups", label: "Signups" },
]

interface AddMetricPanelProps {
  token: string
  metrics: Metric[]
  onAdd: (id: string, delta: number, newTotal: number) => void
}

function AddMetricPanel({ token, metrics, onAdd }: AddMetricPanelProps) {
  const [open, setOpen] = useState(false)
  const [metricName, setMetric] = useState(METRIC_OPTIONS[0].value)
  const [delta, setDelta] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle")
  const [okMsg, setOkMsg] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const current = metrics.find((m) => m.id === metricName)
  const meta = METRIC_META[metricName]
  const deltaNum = Number(delta)
  const newTotal = parseFloat(((current?.value ?? 0) + (Number.isFinite(deltaNum) ? deltaNum : 0)).toFixed(10))

  const fmt = (v: number) =>
    meta.prefix ? `${meta.prefix}${v.toLocaleString()}` : meta.suffix ? `${v}${meta.suffix}` : v.toLocaleString()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")
    try {
      const id = validateMetricId(metricName)
      const d = validateMetricDelta(delta)
      const cur = metrics.find((m) => m.id === id)?.value ?? 0
      const tot = cur + d

      const res = await fetch(`${API_URL}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ metricName: id, delta: d, total: tot, value: tot, date: new Date().toISOString().slice(0, 10) }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }

      onAdd(id, d, tot)
      setOkMsg(`Saved! ${d >= 0 ? "+" : ""}${fmt(d)} → ${fmt(tot)}`)
      setStatus("ok")
      setDelta("")
      setTimeout(() => setStatus("idle"), 2500)
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Invalid input.")
      setStatus("err")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-muted/20">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {open ? <X className="size-4" /> : <Plus className="size-4" />}
        {open ? "Cancel" : "Add Metric"}
      </button>

      {open && (
        <form onSubmit={submit} className="flex flex-col gap-3 border-t border-border p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Metric</label>
              <select
                value={metricName}
                onChange={(e) => {
                  setMetric(e.target.value)
                  setStatus("idle")
                }}
                className="w-full rounded border border-border bg-muted px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
              >
                {METRIC_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                Value
                <span className="ml-1 text-muted-foreground/60">(+add / −subtract)</span>
              </label>
              <input
                type="number"
                value={delta}
                required
                placeholder="+200 or -50"
                step="any"
                onChange={(e) => setDelta(e.target.value)}
                className="w-full rounded border border-border bg-muted px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          {delta !== "" && Number.isFinite(deltaNum) && (
            <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs">
              <span className="text-muted-foreground">Current:</span>
              <span className="text-foreground">{fmt(current?.value ?? 0)}</span>
              <span className="text-muted-foreground">→</span>
              <span className={`font-semibold ${deltaNum >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(newTotal)}</span>
              <span className={`ml-auto ${deltaNum >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {deltaNum >= 0 ? "+" : ""}
                {fmt(deltaNum)}
              </span>
            </div>
          )}

          {status === "ok" && <p className="text-xs text-emerald-400">{okMsg}</p>}
          {status === "err" && <p className="text-xs text-red-400">{errMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </form>
      )}
    </div>
  )
}

function DashboardView({ auth, onLogout }: { auth: AuthState; onLogout: () => void }) {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState("")
  const [seconds, setSeconds] = useState(SESSION_SECONDS)
  const [deltaFlash, setDeltaFlash] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch(`${API_URL}/metrics`, { headers: { Authorization: `Bearer ${auth.token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { metrics?: DynamoItem[] }) => {
        setMetrics(buildMetrics(data.metrics ?? []))
      })
      .catch((err: unknown) => setFetchErr(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [auth.token])

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  const handleLogout = useCallback(async () => {
    await cognitoLogout(auth.token, auth.username)
    onLogout()
  }, [auth.token, auth.username, onLogout])

  useEffect(() => {
    if (seconds === 0) handleLogout()
  }, [seconds, handleLogout])

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")
  const low = seconds < 60

  const handleAdd = (id: string, delta: number, newTotal: number) => {
    if (!VALID_METRIC_IDS.has(id) || !Number.isFinite(delta) || !Number.isFinite(newTotal)) return
    setMetrics((prev) => {
      const existing = prev.find((m) => m.id === id)
      if (existing) {
        return prev.map((m) => {
          if (m.id !== id) return m
          const prevVal = m.history[m.history.length - 1].value
          const newTrend = prevVal !== 0 ? +(((newTotal - prevVal) / prevVal) * 100).toFixed(1) : 0
          return { ...m, value: newTotal, trend: newTrend, history: [...m.history.slice(1), { date: "Now", value: newTotal }] }
        })
      }
      const meta = METRIC_META[id]
      return [...prev, { id, ...meta, value: newTotal, trend: 0, history: [{ date: "Now", value: newTotal }] }]
    })
    setDeltaFlash((f) => ({ ...f, [id]: delta }))
    setTimeout(
      () =>
        setDeltaFlash((f) => {
          const n = { ...f }
          delete n[id]
          return n
        }),
      2500
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${auth.role === "Admin" ? "bg-red-900/40 text-red-300 ring-red-800" : "bg-muted text-muted-foreground ring-border"}`}
        >
          {auth.role}
        </span>

        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-xs tabular-nums ${low ? "text-red-400" : "text-muted-foreground"}`}>
            <Timer className="size-3" />
            {mm}:{ss}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5 pb-10">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading metrics…</p>
        ) : fetchErr ? (
          <p className="text-center text-sm text-red-400">{fetchErr}</p>
        ) : metrics.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No metrics yet — add one below.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {metrics
              .filter((m) => auth.role === "Admin" || m.id !== "revenue")
              .map((m) => (
                <MetricCard key={m.id} m={m} flash={deltaFlash[m.id]} />
              ))}
          </div>
        )}
        {auth.role === "Admin" && !loading && <AddMetricPanel token={auth.token} metrics={metrics} onAdd={handleAdd} />}
      </div>
    </div>
  )
}

function DashboardPanel() {
  const [auth, setAuth] = useState<AuthState | null>(null)

  return (
    <div className="w-full max-w-4xl overflow-x-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="text-sm font-medium text-foreground">SaaS Dashboard</span>
        <span className="rounded-full bg-emerald-900/40 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-800">
          Live Demo
        </span>
      </div>

      <div className="flex min-h-[680px] flex-col">
        {auth ? <DashboardView auth={auth} onLogout={() => setAuth(null)} /> : <LoginScreen onLogin={setAuth} />}
      </div>
    </div>
  )
}

export default function MicroservicePage() {
  return (
    <div className="flex w-full flex-col items-center gap-8 overflow-x-hidden px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Microservice Architecture</h1>
        <div className="mt-3 flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-1.5">
            {["Next.js", "TypeScript", "Tailwind CSS", "Recharts"].map((tag) => (
              <span key={tag} className="rounded bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {["Terraform IaC", "AWS", "Cognito Auth", "Lambda", "API Gateway", "DynamoDB"].map((tag) => (
              <span key={tag} className="rounded bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <CredentialsCard />
      <DashboardPanel />
    </div>
  )
}
