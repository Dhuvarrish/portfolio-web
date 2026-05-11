import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <SidebarProvider defaultOpen={false}>
              <div className="flex flex-1 overflow-hidden">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
            </SidebarProvider>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
