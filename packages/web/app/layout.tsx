import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";
import { HeaderView } from "@/components/views/headerView";
import { Toaster } from "@/components/ui/toaster";
import { HeaderManager } from "@/components/views/header-manager";
import { I18nClientProvider } from "@/components/i18n/client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bondma - Localization Management Solution",
  description: "A localization management platform designed for development teams, helping you efficiently manage multilingual projects and collaborate seamlessly on translations.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <I18nClientProvider>
              <HeaderManager>
                <HeaderView />
              </HeaderManager>
              <main className="flex-1">
                {children}
              </main>
            </I18nClientProvider>
            <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center">
              <Toaster />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
