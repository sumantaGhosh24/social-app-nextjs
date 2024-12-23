import "./globals.css";
import {Inter as FontSans} from "next/font/google";
import type {Metadata} from "next";
import Script from "next/script";

import {cn} from "@/lib/utils";
import {Toaster} from "@/components/ui/toaster";
import getServerUser from "@/actions/getServerUser";
import {ThemeProvider} from "@/components/theme-provider";
import PrimaryColorProvider from "@/components/primary-provider";
import AuthProvider from "@/components/auth-provider";
import Header from "@/components/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Social App",
    template: "%s | Social App",
  },
  description: "Social media app using nextjs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PrimaryColorProvider>
            <AuthProvider>
              <Header user={user ? JSON.parse(JSON.stringify(user)) : null} />
              <main>{children}</main>
              <Toaster />
            </AuthProvider>
          </PrimaryColorProvider>
        </ThemeProvider>
      </body>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </html>
  );
}
