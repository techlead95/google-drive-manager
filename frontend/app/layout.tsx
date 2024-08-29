"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TokensProvider } from "@/contexts/tokens-context";
import { ApiClientProvider } from "@/contexts/api-client-context";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TokensProvider>
          <ApiClientProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <Toaster />
            </QueryClientProvider>
          </ApiClientProvider>
        </TokensProvider>
      </body>
    </html>
  );
}
