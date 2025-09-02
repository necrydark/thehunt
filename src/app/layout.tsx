import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/lib/providers/trpc-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | The Hunt 2025: Prepare For Mayhem",
    absolute: "The Hunt 2025: Prepare For Mayhem",
  },
  description:
    "The Hunt 2025: Prepare For Mayhem is a charity event hosted by Ki11er Six and the Borderlands Community. This event is ran to fundraise money for the St Judes charity, it works by getting specific weapon drops in game and each drop is tied to an point system, the more points the higher you are on the leaderboard.",
  openGraph: {
    description:
      "The Hunt 2025: Prepare For Mayhem is a charity event hosted by Ki11er Six and the Borderlands Community. This event is ran to fundraise money for the St Judes charity, it works by getting specific weapon drops in game and each drop is tied to an point system, the more points the higher you are on the leaderboard.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` font-display antialiased`}>
        <TRPCProvider>
          {children}
          <Toaster />
        </TRPCProvider>
      </body>
    </html>
  );
}
