import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100vh - var(--header-height) - var(--footer-height))" }}
    >
      <LoadingSpinner size="lg" />
    </div>
  )
}
