import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReset } from "@/components/scroll-reset"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Header />
        <ScrollReset />
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <main className="mt-16 mb-12 w-full mx-auto h-[calc(100vh-var(--header-height)-var(--footer-height))] overflow-y-auto">
            <div className="flex-1 min-w-0 lg:max-w-[90%] p-4 md:p-8 peer-data-[state=collapsed]:pl-4 transition-[padding] duration-200 ease-linear">
              {children}
            </div>
          </main>
          <Footer />
        </SidebarProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
