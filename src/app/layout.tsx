import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "~/providers/theme-provider";
import { AppProvider } from "~/providers/app-provider";

export const metadata: Metadata = {
  title: "Mini Rail",
  description: "Mini rail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className="h-full">
        <head />
        <body className="h-full">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AppProvider>{children}</AppProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
