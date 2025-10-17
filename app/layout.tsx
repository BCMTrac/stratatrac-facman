import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { WorkflowToastNotifier } from "@/components/workflow/WorkflowToastNotifier";
import { WorkflowExecutionToasts } from "@/components/workflow/WorkflowExecutionToasts";
import { DataLoader } from "@/components/shared/DataLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strata Facilities Booking System",
  description: "Manage and book your community facilities with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataLoader />
        {children}
        <WorkflowToastNotifier />
        <WorkflowExecutionToasts />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}