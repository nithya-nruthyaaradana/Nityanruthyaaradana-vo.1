import type { Metadata } from "next";
import { Literata } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const literata = Literata({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nithyanruthyaaradana - Bharatanatyam Academy",
  description: "Premier institution dedicated to the preservation and promotion of Bharatanatyam, one of the oldest and most revered classical dance forms of India.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
