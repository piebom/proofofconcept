import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NetworkStatusProvider } from "@/components/networkStatusProvider";
import Provider from "./_provider";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} >
        <NetworkStatusProvider>
        <Provider>
          <Header/>
          {children}
          <Toaster theme="light" richColors={true}/>
        </Provider>
        </NetworkStatusProvider>
        </body>
    </html>
  );
}
